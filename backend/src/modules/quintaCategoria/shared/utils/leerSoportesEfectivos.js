// REPOSITORIOS (INFRAESTRUCTURA)
const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const SequelizeDeclaracionMultiempleoRepository = require("../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository");
const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');
const SequelizeDeclaracionesSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
// CASOS DE USO
const ObtenerDeclaracionMultiempleo = require('../../application/useCases/obtenerDeclaracionMultiempleo');
const ObtenerCertificadoQuinta = require('../../application/useCases/obtenerCertificadoQuinta');
const ObtenerDeclaracionSinPrevios = require('../../application/useCases/obtenerDeclaracionSinPrevios');
// INSTANCIAS DE LOS REPOSITORIOS
const repo = new SequelizeCalculoQuintaCategoriaRepository();
const repoMulti = new SequelizeDeclaracionMultiempleoRepository();
const certRepo = new SequelizeCertificadoQuintaRepository();
const sinPrevRepo = new SequelizeDeclaracionesSinPreviosRepository();
// INSTANCIAS DE LOS CASOS DE USO
const obtenerMultiUC = new ObtenerDeclaracionMultiempleo({ repo: repoMulti });
const obtenerCertificadoUC = new ObtenerCertificadoQuinta({ repo: certRepo });
const obtenerSinPreviosUC = new ObtenerDeclaracionSinPrevios({ repo: sinPrevRepo });

// Multiempleo interno inferido
const _inferirMultiempleoInterno = require('../../shared/utils/inferirMultiempleoInterno');

/**
 * Helper: retenciones internas acumuladas (otras filiales) hasta mes-1
 */
async function _retencionesInternasAcumuladas({ dni, anio, mes, excluirFilialId }) {

  const historialDeRetenciones = await repo.findByWorkerYear({ dni, anio });

  if (!Array.isArray(historialDeRetenciones) || historialDeRetenciones.length === 0) return 0;

  const mesActual = Number(mes);

  // Elegimos la fila vigente por (filial_id, mes): la última creada
  const historialVigentePorClave = new Map();

  for (const registro of historialDeRetenciones) {
    
    const mesDelRegistro = Number(registro.mes);
    // Ignoramos cuando el mes de de la retención sea igual al mes objetivo
    if (!Number.isFinite(mesDelRegistro) || !(mesDelRegistro < mesActual)) continue;

    const idFilial = Number(registro.filial_id);
    // Excluimos la filial pasada por parámetro
    if (Number.isFinite(excluirFilialId) && idFilial === Number(excluirFilialId)) continue;

    const clave = `${idFilial}-${mesDelRegistro}`;
    const registroPrevio = historialVigentePorClave.get(clave);
    if (!registroPrevio) { historialVigentePorClave.set(clave, registro); continue; }

    const fechaCreacionPrevia = new Date(registroPrevio.createdAt || 0).getTime();
    const fechaCreacionActual  = new Date(registro.createdAt || 0).getTime();
    if (fechaCreacionActual > fechaCreacionPrevia || (!fechaCreacionPrevia && Number(registro.id) > Number(registroPrevio.id))) {
      historialVigentePorClave.set(clave, registro);
    }
  }

  let total = 0;

  for (const registro of historialVigentePorClave.values()) {
    total += Number(registro.retencion_base_mes || 0) + Number(registro.retencion_adicional_mes || 0);
  }
  
  return Number(total.toFixed(2));
}


/**
 * Lee soportes efectivos (certificado, Declaración jurada sin previos, Declaración jurada multiempleo) y
 * también infiere multiempleo interno por contratos cuando no hay declaración jurada. 
 */

module.exports = async function _leerSoportesEfectivos({ dni, anio, mes, filialId }) {
  // Obtenemos todos los soportes
  const [certificado, multiEmpleo, sinPrevios ] = await Promise.all([
    obtenerCertificadoUC.execute({ dni, anio }),
    obtenerMultiUC.execute({ dni, anio }),
    obtenerSinPreviosUC.execute({ dni, anio })
  ]);

  const mesNum = Number(mes);
  // el mes de aplicación debe ser menor o igual al mes actual.
  const esVigente = (soporte) => soporte && soporte.found && (!soporte.aplica_desde_mes || Number(soporte.aplica_desde_mes) <= mesNum);
  // para DJ Sin Previos: es vigente si aplica en un mes posterior al actual (para cortar el historial).
  const esVigenteSinPrevios = (soporte) => soporte && soporte.found && (mesNum < Number(soporte.aplica_desde_mes || 13));
  
  // Determinamos cuáles soportes son vigentes para este mes
  const certificadoVigente = esVigente(certificado) ? certificado : null;
  const multiEmpleoVigente = esVigente(multiEmpleo) ? multiEmpleo : null;
  const sinPreviosVigente = esVigenteSinPrevios(sinPrevios) ? sinPrevios : null;

  let ingresosExternos = 0;
  let retencionesExternas = 0;
  let ingresosInternos = 0;
  let retencionesInternas = 0;
  let fuenteExternos = null;

  let origen_retencion = "NINGUNO";
  let es_secundaria = false;
  let filial_retiene_id = Number(filialId);
  let saltarRetener = false;

  // Lógica por prioridad (la más importante primero)
  // a) Declaración Jurada "Sin Previos" domina sobre todo lo demás.
  if (sinPreviosVigente) {
    ingresosExternos = 0;
    retencionesExternas = 0;
    fuenteExternos = "SIN_PREVIOS";
  }
  // b) Certificado de Retenciones (si no hay DJ "Sin Previos").
  else if (certificadoVigente && !sinPreviosVigente) {
    ingresosExternos += Number(certificadoVigente.renta_bruta_total || 0);
    retencionesExternas += Number(certificadoVigente.retenciones_previas || 0);
    fuenteExternos = 'CERTIFICADO';
  }
  // c) Declaración Jurada de Multiempleo (siempre se considera para reglas de retención) 
  if (multiEmpleoVigente) {
    origen_retencion = "DECLARACIÓN JURADA";

    // Si la DJ "Sin Previos" no aplica, se suman los ingresos externos de la DJ Multiempleo.
    if (!sinPreviosVigente) {
     ingresosExternos   += Number(multiEmpleoVigente.renta_bruta_otros_anual || 0);
     retencionesExternas+= Number(multiEmpleoVigente.retenciones_previas_otros || 0);
     fuenteExternos = "DECLARACIÓN JURADA";
    }

    // Determinamos si esta filial es secundaria
    es_secundaria = (multiEmpleoVigente.es_secundaria === true) &&
                    Number(multiEmpleoVigente.filial_principal_id) !== Number(filialId);
    saltarRetener = es_secundaria;
    filial_retiene_id = es_secundaria
      ? Number(multiEmpleoVigente.filial_principal_id || filialId)
      : Number(filialId);
  }

  // d) Inferencia de multiempleo interno (si no hay una DJ de multiempleo)
  if (!multiEmpleoVigente) {
    const inferido = await _inferirMultiempleoInterno({ dni, anio, mes, filialActualId: filialId });

    if (inferido.hayMulti) {
      origen_retencion = "INFERIDO";
      es_secundaria = !!inferido.ActualEsSecundaria;
      saltarRetener = es_secundaria;
      filial_retiene_id = es_secundaria ? Number(inferido.principalId) : Number(filialId);

      if (!es_secundaria) {
        // Si somos la filial principal, sumamos los ingresos y retenciones de las filiales secundarias.
        ingresosInternos += Number(inferido.previosInternos || 0);
        retencionesInternas += await _retencionesInternasAcumuladas({
          dni, anio: Number(anio), mes: Number(mes), excluirFilialId: Number(filialId)
        });
      }
    }
  }

  const resultadoConsolidado = {
    ingresosPrevios: Number((ingresosInternos + ingresosExternos).toFixed(2)),
    retPrevias: Number((retencionesInternas + retencionesExternas).toFixed(2)),
    saltarRetener,
    certificadoOk: certificadoVigente,
    multiEmpleoOk: multiEmpleoVigente,
    sinPreviosOk: sinPreviosVigente,
    meta: {
      origen_retencion,
      es_secundaria,
      filial_retiene_id,
      ingresos_previos_internos: Number(ingresosInternos || 0),
      ingresos_previos_externos: Number(ingresosExternos || 0),
      retenciones_previas_externas: Number(retencionesExternas || 0),
      retenciones_previas_internas: Number(retencionesInternas || 0),
      fuente_externos: fuenteExternos,
      
      certificado_found: !!(certificado && certificado.found),
      certificado_aplica_desde: certificado?.aplica_desde_mes ?? null,
      certificado_ignorado_por_mes: !!(certificado && certificado.found && !certificadoVigente),
      
      sin_previos_found: !!(sinPrevios && sinPrevios.found),
      sin_previos_aplica_desde: sinPrevios?.aplica_desde_mes ?? null,
      sin_previos_vigente_en_mes: !!sinPreviosVigente,
      
      soporte_multiempleo_id: multiEmpleoVigente?.id || null, 
      soporte_certificado_id: certificadoVigente?.id || null, 
      soporte_sin_previos_id: sinPreviosVigente?.id || null,
      
      soportes_json: {
        certificado: certificadoVigente || null,
        multiempleo: multiEmpleoVigente || null,
        sin_previos: sinPreviosVigente || null
      }
    }
  };
  
  return resultadoConsolidado;
}