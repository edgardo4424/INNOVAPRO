const SequelizeCalculoQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const CalcularQuintaProyectada = require('../../application/useCases/calcularQuintaProyectada');
const GuardarCalculoQuinta = require('../../application/useCases/guardarCalculoQuinta');
const RecalcularQuinta = require('../../application/useCases/recalcularQuinta');
const ObtenerIngresosPrevios = require('../../application/useCases/obtenerIngresosPrevios');
const ObtenerRetencionBaseMesPorDni = require('../../application/useCases/obtenerRetencionBaseMesPorDni');

const SequelizeDeclaracionMultiempleoRepository = require("../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository");
const ObtenerDeclaracionMultiempleo = require('../../application/useCases/obtenerDeclaracionMultiempleo');

const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');
const SequelizeDeclaracionesSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const ObtenerCertificadoQuinta = require('../../application/useCases/obtenerCertificadoQuinta');
const ObtenerDeclaracionSinPrevios = require('../../application/useCases/obtenerDeclaracionSinPrevios');

const SequelizeContratoLaboralRepository = require('../../../contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository');

const repo = new SequelizeCalculoQuintaCategoriaRepository();
const repoMulti = new SequelizeDeclaracionMultiempleoRepository();
const certRepo = new SequelizeCertificadoQuintaRepository();
const sinPrevRepo = new SequelizeDeclaracionesSinPreviosRepository();
const contratoRepo = new SequelizeContratoLaboralRepository();

const calcularUC = new CalcularQuintaProyectada();
const guardarUC = new GuardarCalculoQuinta(repo);
const recalcularUC = new RecalcularQuinta(repo);
const obtenerIngresosUC = new ObtenerIngresosPrevios();
const obtenerBaseMesUC = new ObtenerRetencionBaseMesPorDni({ repo });
const obtenerMultiUC = new ObtenerDeclaracionMultiempleo({ repo: repoMulti });
const obtenerCertificadoUC = new ObtenerCertificadoQuinta({ repo: certRepo });
const obtenerSinPreviosUC = new ObtenerDeclaracionSinPrevios({ repo: sinPrevRepo });

const enriquecerConContratoOFalla = require('../../shared/utils/enriquecerConContratoOFalla'); // Si no llega remuneración, la tomamos del contrato vigente (y validamos quinta_categoria)
const { mapCalculoQuintaToResponse } = require('../../shared/mappers/mapCalculoQuintaToResponse'); // Para devolver ordenado al frontend
const buildQuintaInput = require('./_buildQuintaInput');
const { aplicarSoportesPrevios } = require('../../application/services/AplicarSoportesPrevios');

async function _recortarPreviosDesdeCutoff({
  dni, anio, mes,
  trabajadorId,
  remuneracionMensualActual,
  fuentePrevios = 'AUTO',
  certificadoQuinta = null,
  filialIdPreferida = null,
  contratoId = null,
  asignacion_familiar = false,
  asignacion_familiar_desde = null,
  payloadCalculo,
  obtenerIngresosUC,
  sinPrevRepo,
}) {
  const dj = await sinPrevRepo.obtenerPorDniAnio({ dni, anio: Number(anio) || 0 });
  const aplica = Number(dj?.aplica_desde_mes || 0);
  const m = Number(mes) || 0;
  if (!dj || !aplica || m < aplica) return; // recortamos solo cuando mes >= aplica

  const baseExec = {
    trabajadorId: Number(trabajadorId) || undefined,
    dni,
    anio: Number(anio),
    remuneracionMensualActual: Number(remuneracionMensualActual || 0),
    fuentePrevios,
    certificadoQuinta,
    filialIdPreferida,
    contratoId,
    asignacion_familiar: Boolean(asignacion_familiar),
    asignacion_familiar_desde,
  };

  let A = null, B = null;
  try {
    // A) acumulado Ene..(mes-1) → en tu UC se logra pasando mes = m
    A = await obtenerIngresosUC.execute({ ...baseExec, mes: m });
    // B) acumulado Ene..(aplica-1) → en tu UC se logra pasando mes = aplica
    B = await obtenerIngresosUC.execute({ ...baseExec, mes: aplica });
  } catch (e) {
    console.warn('[DJ SinPrevios] No se pudo obtener A/B para recorte:', e?.message);
    return;
  }

  const getBlock = (x) => x?.ingresosPrevios ?? x?.ingresos_previos ?? {};
  const getRet   = (x) => (x?.retencionesPrevias ?? x?.retenciones_previas ?? 0);

  const ingA = getBlock(A);
  const ingB = getBlock(B);

  // Diff solo en campos numéricos + preserva estructuras auxiliares
  const num = (v) => Number(v || 0);
  const diff = {
    remuneraciones: Math.max(0, num(ingA.remuneraciones) - num(ingB.remuneraciones)),
    gratificaciones: Math.max(0, num(ingA.gratificaciones) - num(ingB.gratificaciones)),
    bonos: Math.max(0, num(ingA.bonos) - num(ingB.bonos)),
    asignacion_familiar: Math.max(0, num(ingA.asignacion_familiar) - num(ingB.asignacion_familiar)),
    gratiJulioTrabajador: num(ingA.gratiJulioTrabajador),
    gratiJulioProj: num(ingA.gratiJulioProj),
    gratiDiciembreTrabajador: num(ingA.gratiDiciembreTrabajador),
    gratiDiciembreProj: num(ingA.gratiDiciembreProj),
    extraGravadoMes: num(ingA.extraGravadoMes),
    es_proyeccion: true,
    remu_multi: ingA.remu_multi || null,
    grati_multi: ingA.grati_multi || null,
    af_multi: ingA.af_multi || null,
  };
  diff.total_ingresos = Number((diff.remuneraciones + diff.gratificaciones + diff.bonos + diff.asignacion_familiar).toFixed(2));

  const retDiff = Math.max(0, Number(getRet(A)) - Number(getRet(B)));

  // Sobrescribe lo que leerá el UC de cálculo
  payloadCalculo.ingresosPrevios = diff;
  payloadCalculo.retencionesPrevias = retDiff;

  console.log('[DJ SinPrevios] Recorte aplicado → aplica=%s, mes=%s, total_diff=%s, ret_diff=%s',
    aplica, m, diff.total_ingresos, retDiff);
}


function absolutize(url, req) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = `${req.protocol}://${req.get('host')}`;
  return url.startsWith('/uploads') ? `${base}${url}` : url;
}

/**
 * Dado un set de contratos activos en el mes para el mismo DNI:
 * - Elige filial principal (regla: la de mayor sueldo si no hay declaración jurada)
 * - Calcula ingresos previos internos (enero..mes-1) de las otras filiales
 * - Determina si debemos NO retener en la filial actual
 */
function _mesesDevengadosAnioHasta(anio, mes, fIni, fFin) {
  const year = Number(anio);
  const month = Number(mes);
  if (month <= 1 ) return 0;
  const inicio = new Date(fIni || `${year}-01-01`);
  const fin = new Date(fFin || `${year}-12-31`);

  // Tramo considerado: enero...(mes-1) del mismo año
  const desde = new Date(`${year}-01-01`);
  const hasta = new Date(`${year}-${String(month - 1).padStart(2, "0")}-28`);
  const a = new Date(Math.max(inicio, desde));
  const b = new Date(Math.min(fin, hasta));
  if (a > b) return 0;
  
  // contar meses calendario
  let meses = 0;
  const cur = new Date(a.getFullYear(), a.getMonth(), 1);
  const end = new Date(b.getFullYear(), b.getMonth(), 1);
  while (cur <= end) {
    meses++;
    cur.setMonth(cur.getMonth() + 1);
  }
  return meses;
}

async function _inferirMultiempleoInterno({ dni, anio, mes, filialActualId }) {
  console.log("----- COMO NO HAY SOPORTES INFERIMOS MULTIEMPLEO INTERNO ------")
  const contratos = await contratoRepo.obtenerContratosActivosPorDniEnMes(dni, anio, mes);
  
  if (!contratos || contratos.length <= 1) {
    return { hayMulti: false, principalId: null, ActualEsSecundaria: false, previosInternos: 0, debug: { razon: "UNA_SOLA_FILIAL_O_MENOS"} };
  }

  // Agrupar por filial_id y quedarnos con el contrato "representante" de cada filial:
  // - Prioridad: mayor sueldo
  // - Decisión: fecha_inicio más antigua
  // - Segunda decisión: id más bajo

  // Primero mapeamos todos los contratos por filiales
  const porFilial = new Map();
  for (const contrato of contratos || []) {
    const filialId = Number(contrato.filial_id);
    if (!porFilial.has(filialId)) porFilial.set(filialId, []);
    porFilial.get(filialId).push(contrato);
  }

  // Si no hay al menos 2 filiales distintas activas NO hay multiempleo interno
  if (porFilial.size <= 1) {
    return {
      hayMulti: false,
      principalId: null,
      ActualEsSecundaria: false,
      previosInternos: 0,
      debug: { razon: "UNA_SOLA_FILIAL_ACTIVA", totalContratos: contratos?.length || 0 }
    };
  }

  // Representante por filial
  const representante = [...porFilial.values()].map(array =>
    array.sort((a,b) => {
      const sb = Number(b.sueldo) - Number(a.sueldo);
      if(sb !== 0) return sb;
      const fa = new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
      if(fa !== 0) return fa;
      return Number(a.id) - Number(b.id);
    })[0]
  );

  // Elegimos principal por mayor sueldo; en empate aplica las mismas decisiones ya usadas
  const principal = [...representante].sort((a, b) => {
    const sb = Number(b.sueldo) - Number(a.sueldo);
    if(sb !== 0) return sb;
    const fa = new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
    if (fa !== 0) return fa;
    return Number(a.id) - Number(b.id);
  })[0];
 
  const principalId = Number(principal.filial_id);

  // Devengados internos (enero.. mes-1) de las OTRAS filiales distintas a la actual
  let previosInternos = 0;
  for (const repre of representante) {
    if(Number(repre.filial_id) === Number(principalId)) continue;
    const meses = _mesesDevengadosAnioHasta(anio, mes, repre.fecha_inicio, repre.fecha_fin);
    previosInternos += Number(repre.sueldo) * Math.max(0, meses - 1);
  }
  
  const ActualEsSecundaria = Number(filialActualId) !== principalId;

  /* const detalle = contratos.map(contrato => ({
    tipo: "FILIAL",
    filial_id: Number(contrato.filial_id),
    sueldo: Number(contrato.sueldo),
    fecha_inicio: contrato.fecha_inicio,
    fecha_fin: contrato.fecha_fin,
  }));

  const saltarRetener = Number(filialActualId) !== principalId; */

  return {
    hayMulti: true,
    principalId,
    ActualEsSecundaria,
    previosInternos,
    debug: {
      regla: "MAYOR_SUELDO",
      representantes: representante.map(r => ({
        filial_id: Number(r.filial_id),
        sueldo: Number(r.sueldo),
        fecha_inicio: r.fecha_inicio,
        fecha_fin: r.fecha_fin,
        contrato_id: Number(r.id)
      })),
      filial_actual_id: Number(filialActualId),
      principal_id: principalId
    }
    /* saltarRetener,
    detalle */
  };
}

/**
 * Helper: retenciones internas acumuladas (otras filiales) hasta mes-1
 * 
 */
async function _retencionesInternasAcumuladas({ dni, anio, mes, excluirFilialId }) {
  // Usa el repo de quinta que ya usas en el controller (findByWorkerYear)
  const historicos = await repo.findByWorkerYear({ dni, anio });
  if (!Array.isArray(historicos) || historicos.length === 0) return 0;

  const mesObj = Number(mes);
  // Elegimos la fila vigente por (filial_id, mes): la última creada
  const vigentePorClave = new Map();
  for (const fila of historicos) {
    const mesFila = Number(fila.mes);
    if (!Number.isFinite(mesFila) || !(mesFila < mesObj)) continue;
    const filaid = Number(fila.filial_id);
    if (Number.isFinite(excluirFilialId) && filaid === Number(excluirFilialId)) continue;

    const llave = `${filaid}-${mesFila}`;
    const prev = vigentePorClave.get(llave);
    if (!prev) { vigentePorClave.set(llave, fila); continue; }

    const dPrev = new Date(prev.createdAt || 0).getTime();
    const dCur  = new Date(fila.createdAt || 0).getTime();
    if (dCur > dPrev || (!dPrev && Number(fila.id) > Number(prev.id))) {
      vigentePorClave.set(llave, fila);
    }
  }

  let total = 0;
  for (const fila of vigentePorClave.values()) {
    total += Number(fila.retencion_base_mes || 0) + Number(fila.retencion_adicional_mes || 0);
  }
  return Number(total.toFixed(2));
}

/**
 * Lee soportes efectivos (certificado, Declaración jurada sin previos, Declaración jurada multiempleo) y
 * ahora también infiera multiempleo interno por contratos cuando no hay declaración jurada. 
 */

async function _leerSoportesEfectivos({ dni, anio, mes, filialId }) {
  const [certificado, multiEmpleo, sinPrevios ] = await Promise.all([
    obtenerCertificadoUC.execute({ dni, anio }),
    obtenerMultiUC.execute({ dni, anio }),
    obtenerSinPreviosUC.execute({ dni, anio })
  ]);
  console.log("CERTIFICADO EN LEER SOPORTE: ", certificado)
  console.log("MULTIEMPLEO EN LEER SOPORTE: ", multiEmpleo)
  console.log("SINPREVIOS EN LEER SOPORTE: ", sinPrevios)

  const mesNum = Number(mes);
  const vigenteGeneral = (x) => x && x.found && (!x.aplica_desde_mes || Number(x.aplica_desde_mes) <= mesNum);
  // Declaración Jurada Sin Previos: Solo pasado = vigente si mes < aplica_desde_mes
  const vigenteSinPrev = (x) => x && x.found && (mesNum < Number(x.aplica_desde_mes || 13));
  
  const certificadoOk = vigenteGeneral(certificado) ? certificado : null;
  const multiEmpleoOk = vigenteGeneral(multiEmpleo) ? multiEmpleo : null;
  const sinPreviosOk = vigenteSinPrev(sinPrevios) ? sinPrevios : null;
  console.log("CERTIFICADO VIGENTE EN LEER SOPORTE: ", certificadoOk)
  console.log("MULTIEMPLEO VIGENTE EN LEER SOPORTE: ", multiEmpleoOk)
  console.log("SINP REVIOS VIGENTE EN LEER SOPORTE: ", sinPreviosOk)

  let ingresosExternos = 0;
  let retencionesExternas = 0;
  let ingresosInternos = 0;
  let retencionesInternas = 0;

  // Metadata de quién retiene
  let origen_retencion = "NINGUNO";
  let es_secundaria = false;
  let filial_retiene_id = Number(filialId);

  // 1) Declaración "Sin previos" domina
  if (sinPreviosOk) {
    ingresosExternos = 0;
    retencionesExternas = 0;
  }
  // 2) Certificado externo
  else if (certificadoOk && !sinPreviosOk) {
    ingresosExternos += Number(certificadoOk.renta_bruta_total || 0);
    retencionesExternas += Number(certificadoOk.retenciones_previas || 0);
  }

  // 3) Declaracion Jurada multiempleo decide prioridad y puede aportar internos si somos principal
  if(multiEmpleoOk) {
    origen_retencion = "DJ";

    // externos por empleadores EXTERNOS + retenciones de DJ
    if(Array.isArray(multiEmpleoOk.detalles)) {
      multiEmpleoOk.detalles.forEach(detalle => {
        if (detalle.tipo === "EXTERNO" && !sinPreviosOk) {
          ingresosExternos += Number(detalle.renta_bruta_anual || 0);
          retencionesExternas += Number(detalle.retenciones_previas || 0);
        }
        if (detalle.tipo === "FILIAL" && Number(detalle.filial_id) !== Number(filialId)) {
          if (Number(multiEmpleoOk.filial_principal_id) === Number(filialId)) {
            ingresosInternos += Number(detalle.renta_bruta_anual || 0);
            retencionesInternas += Number(detalle.retenciones_previas || 0);
          }
        }
      });
    }

    es_secundaria = (multiEmpleoOk.somos_secundario_no_retiene === true) &&
                    Number(multiEmpleoOk.filial_principal_id) !== Number(filialId);

    
    
    filial_retiene_id = es_secundaria
      ? Number(multiEmpleoOk.filial_principal_id || filialId)
      : Number(filialId);
  }

  // 4) **Inferencia** de multiempleo interno por contratos cuando NO hay Declaración Jurada:
  if (!multiEmpleoOk) {
    const inferido = await _inferirMultiempleoInterno({ dni, anio, mes, filialActualId: filialId });
    console.log("RESPUESTA DE INFERIDO CUANDO NO HAY DJ DE MULTIEMPLEO: ", inferido)
    if (inferido.hayMulti) {
      origen_retencion = "INFERIDO";
      es_secundaria = !!inferido.ActualEsSecundaria;
      filial_retiene_id = es_secundaria ? Number(inferido.principalId) : Number(filialId);
      // Si somos PRINCIPAL, sumamos ingresos y retenciones internas acumuladas (otras filiales)
      if (!es_secundaria) {
        ingresosInternos += Number(inferido.previosInternos || 0);
        retencionesInternas += await _retencionesInternasAcumuladas({
          dni, anio: Number(anio), mes: Number(mes), excluirFilialId: Number(filialId)
        });
      }
      console.log("SI SOMOS PRINCIPAL LOS INGRESOS INTERNOS SON: ", ingresosInternos)
      console.log("SI SOMOS PRINCIPAL LAS RETENCIONES INTERNAS SON: ", retencionesInternas)

    }
  }

  // Consolidado para el cálculo
  const ingresosPrevios = Number(ingresosInternos || 0) + Number(ingresosExternos || 0);
  const retPrevias = Number(retencionesExternas || 0) + Number(retencionesInternas || 0);
  const saltarRetener = !!es_secundaria;

  // IDs + snapshots
  const soporte_multiempleo_id = multiEmpleoOk?.id || null;
  const soporte_certificado_id = certificadoOk?.id || null;
  const soporte_sin_previos_id = sinPreviosOk?.id || null;

  const soportes_json = {
    certificado: certificadoOk || null,
    multiempleo: multiEmpleoOk || null,
    sin_previos: sinPreviosOk || null
  }
  
  return { 
    ingresosPrevios, retPrevias, saltarRetener, 
    certificadoOk, multiEmpleoOk, sinPreviosOk,
    meta: {
      origen_retencion,
      es_secundaria,
      filial_retiene_id,
      ingresos_previos_internos: Number(ingresosInternos || 0),
      ingresos_previos_externos: Number(ingresosExternos || 0),
      retenciones_previas_externas: Number(retencionesExternas || 0),
      retenciones_previas_internas: Number(retencionesInternas || 0),
      soporte_multiempleo_id, soporte_certificado_id, soporte_sin_previos_id,
      soportes_json,
    }
  };
}

module.exports = {
  async previsualizar(req, res) {
    try {
      console.log("REQUEST PARA PREVISUALIZAR QUE VIENE DEL FRONT: ", req.body)

      // Contrato + elegibilidad
      const error = await enriquecerConContratoOFalla(req);
      if (error) return res.status(error.status).json({ ok: false, message: error.message });

      const filialActualId = Number(req.body.__filialId);
      const { dni } = req.body;
      const anio = Number(req.body.anio);
      const mes  = Number(req.body.mes);

      const contratoId   = Number(req.body.contratoId);
      const trabajadorId = Number(req.body.__trabajadorId || req.body.trabajadorId);

      // Normaliza fuente
      const fuentePrevios = String(req.body.fuentePrevios || 'AUTO').toUpperCase();

      // CLAVE: nombre correcto que el UC espera
      const remuneracionMensualActual = Number(req.body.remuneracionMensualActual || 0);

      // 1) LEER SOPORTES PRIMERO
      const djSinPrevios = await sinPrevRepo.obtenerPorDniAnio({ dni, anio });
      const sinPreviosAplicaDesde = Number(djSinPrevios?.aplica_desde_mes || 0) || null;

      const djMulti = await repoMulti.obtenerPorDniAnio({ dni, anio });
      const multiAplicaDesde = Number(djMulti?.aplica_desde_mes || 0) || null;

      const certificado = await certRepo.obtenerPorDniAnio({ dni, anio });
      const certificadoDTO = certificado ? {
        id: certificado.id,
        renta_bruta_total: Number(certificado.renta_bruta_total || 0),
        remuneraciones: Number(certificado.remuneraciones || 0),
        gratificaciones: Number(certificado.gratificaciones || 0),
        otros: Number(certificado.otros || 0),
        asignacion_familiar: Number(certificado.asignacion_familiar || 0),
        retenciones_previas: Number(certificado.retenciones_previas || 0)
      } : null;

      // 2) BASE de ingresos previos (recortada si aplica)
      const obtenerPrevUC = new ObtenerIngresosPrevios();
      let base = await obtenerPrevUC.execute({
        trabajadorId,
        dni,
        anio,
        mes,
        remuneracionMensualActual,
        fuentePrevios,
        certificadoQuinta: (fuentePrevios === 'CERTIFICADO' && certificadoDTO) ? certificadoDTO : null,
        filialIdPreferida: filialActualId,
        contratoId,
        asignacion_familiar: req.body.__tiene_asignacion_familiar || false,
        asignacion_familiar_desde: req.body.__asignacion_familiar_desde || "",
        sinPreviosAplicaDesde 
      });

      // consultamos retenciones previas (regla “vigente por mes”)
      const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId,
        anio,
        mes,
      });

      console.log("RETENCIÓN TOTAL EN BASE DE DATOS SACADA DE BUILD: ", retPreviasDB)

      // suma de certificado solo si la fuente es CERTIFICADO
      const retencionesPrevias =
        Number(retPreviasDB || 0) +
        (req.body?.fuentePrevios === 'CERTIFICADO'
          ? Number(req.body?.certificadoQuinta?.retenciones_previas || 0)
          : 0);
        
      console.log("RETENCIÓN TOTAL SUMANDO LAS DEL CERTIFICADO: ", retencionesPrevias)
      
      const esProyeccion = !!base.es_proyeccion;

      // Defensa: jamás dejar base undefined
      if (!base || typeof base !== 'object') {
        base = {
          remuneraciones: 0, gratificaciones: 0, bonos: 0,
          asignacion_familiar: 0, gratiJulioTrabajador: 0,
          gratiJulioProj: 0, gratiDiciembreTrabajador: 0,
          gratiDiciembreProj: 0, extraGravadoMes: 0,
          es_proyeccion: false, total_ingresos: 0
        };
      }
      console.log("BASE INICIAL EN PREVISUALIZAR (recortada si DJ aplica): ", base);

      // Consolidar soportes efectivos por mes
      const soportes = await _leerSoportesEfectivos({
        dni, anio: Number(anio), mes: Number(mes), filialId: filialActualId
      });
      console.log("RESPUESTA DE SOPORTES EN PREVISUALIZAR: ", soportes)

      // 3) Payload de cálculo
      let payload = {
        dni,
        trabajadorId,
        anio,
        mes,
        contratoId,
        remuneracionMensualActual,
        ingresos_previos_internos: Number(soportes.ingresosPrevios || 0),
        retenciones_previas_internas: soportes.saltarRetener ? 0 : Number(soportes.retPrevias || 0),
        ingresosPrevios: base,
        retencionesPrevias: retencionesPrevias, 
        esProyeccion: esProyeccion,
        fuentePrevios,
        otrosIngresosProyectados: Number(req.body.otrosIngresosProj || 0),
      };

      // 4) Aplicar DJ Sin Previos: sólo actúa si mes < aplica (total a 0). 
      payload = await aplicarSoportesPrevios({ dni, anio, mes, payload });

      console.log("PAYLOAD ENVIADO A CALCULAR EN PREVISUALIZAR: ", payload)

      // 5) Calcular
      const dto = await calcularUC.execute(payload);

      // Si somos secundarios la retención base del mes = 0
      if (soportes.meta.es_secundaria || payload?._saltarRetener) {
        dto.retencion_base_mes = 0;
        dto.retencion_adicional_mes = 0;
      }

      console.log("DATOS RECIBIDOS DESPUES DE CALCULAR: ", dto)

      const response = mapCalculoQuintaToResponse(dto);

      // Entradas visibles al front 
      response.entradas = {
        ...(response.entradas || {}),
        remuneracion_mensual: remuneracionMensualActual,
        grati_julio_proj: base.gratiJulioProj,
        grati_diciembre_proj: base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otrosIngresosProj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
      }

      // Forzar el id del trabajador en la respuesta
      if (response.trabajador) {
        response.trabajador.id = Number(trabajadorId); 
      }

      // Adjuntar soportes al payload de respuesta (con URLs absolutas si existen)
      const multi = soportes.multiEmpleoOk ? { ...soportes.multiEmpleoOk } : null;
      if (multi?.archivo_url) multi.archivo_url = absolutize(multi.archivo_url, req);
      const cert = soportes.certificadoOk ? { ...soportes.certificadoOk } : null;
      if (cert?.archivo_url) cert.archivo_url = absolutize(cert.archivo_url, req);
      const sp = soportes.sinPreviosOk ? { ...soportes.sinPreviosOk } : null;
      if (sp?.archivo_url) sp.archivo_url = absolutize(sp.archivo_url, req);

      return res.json({
        ok: true,
        data: {
          ...response,
          ingresos_previos: base,
          retencion_meta: soportes.meta,
          soportes: { 
            certificado: cert,
            multiempleo: multi,
            sinPrevios: sp,
          }
        }
      });

    } catch (error) {
      console.error("Error en previsualizar quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },

  async crear(req, res) {
    try {
      const filialActualId = Number(req.body.__filialId);
      const { dni } = req.body;
      const anio = Number(req.body.anio);
      const mes  = Number(req.body.mes);

      const contratoId   = Number(req.body.contratoId);
      const trabajadorId = Number(req.body.__trabajadorId || req.body.trabajadorId);

      // Normaliza fuente
      const fuentePrevios = String(req.body.fuentePrevios || 'AUTO').toUpperCase();

      // CLAVE: nombre correcto que el UC espera
      const remuneracionMensualActual = Number(req.body.remuneracionMensualActual || 0);

      // 1) LEER SOPORTES PRIMERO
      const djSinPrevios = await sinPrevRepo.obtenerPorDniAnio({ dni, anio });
      const sinPreviosAplicaDesde = Number(djSinPrevios?.aplica_desde_mes || 0) || null;

      // 2) BASE de ingresos previos (recortada si aplica)
      const obtenerPrevUC = new ObtenerIngresosPrevios();
      let base = await obtenerPrevUC.execute({
        trabajadorId,
        dni,
        anio,
        mes,
        remuneracionMensualActual,
        fuentePrevios,
        certificadoQuinta: req.body.certificadoQuinta || null,
        filialIdPreferida: filialActualId,
        contratoId,
        asignacion_familiar: req.body.__tiene_asignacion_familiar || false,
        asignacion_familiar_desde: req.body.__asignacion_familiar_desde || "",
        sinPreviosAplicaDesde 
      });

      // consultamos retenciones previas (regla “vigente por mes”)
      const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId,
        anio,
        mes,
      });

      console.log("RETENCIÓN TOTAL EN BASE DE DATOS SACADA DE BUILD: ", retPreviasDB)

      // suma de certificado solo si la fuente es CERTIFICADO
      const retencionesPrevias =
        Number(retPreviasDB || 0) +
        (req.body?.fuentePrevios === 'CERTIFICADO'
          ? Number(req.body?.certificadoQuinta?.retenciones_previas || 0)
          : 0);
        
      console.log("RETENCIÓN TOTAL SUMANDO LAS DEL CERTIFICADO: ", retencionesPrevias)
      
      const esProyeccion = !!base.es_proyeccion;

      // Defensa: jamás dejar base undefined
      if (!base || typeof base !== 'object') {
        base = {
          remuneraciones: 0, gratificaciones: 0, bonos: 0,
          asignacion_familiar: 0, gratiJulioTrabajador: 0,
          gratiJulioProj: 0, gratiDiciembreTrabajador: 0,
          gratiDiciembreProj: 0, extraGravadoMes: 0,
          es_proyeccion: false, total_ingresos: 0
        };
      }
      console.log("BASE INICIAL EN PREVISUALIZAR (recortada si DJ aplica): ", base);

      // Consolidar soportes efectivos por mes
      const soportes = await _leerSoportesEfectivos({
        dni, anio: Number(anio), mes: Number(mes), filialId: filialActualId
      });
      console.log("RESPUESTA DE SOPORTES EN PREVISUALIZAR: ", soportes)

      // 3) Payload de cálculo
      let payload = {
        dni,
        trabajadorId,
        anio,
        mes,
        contratoId,
        remuneracionMensualActual,
        ingresos_previos_internos: Number(soportes.ingresosPrevios || 0),
        retenciones_previas_internas: soportes.saltarRetener ? 0 : Number(soportes.retPrevias || 0),
        ingresosPrevios: base,
        retencionesPrevias: retencionesPrevias, 
        esProyeccion: esProyeccion,
        fuentePrevios,
        otrosIngresosProyectados: Number(req.body.otrosIngresosProj || 0),
      };

      await aplicarSoportesPrevios({ dni, anio, mes, payload: payloadCalculo });
      await _recortarPreviosDesdeCutoff({
        dni,
        anio,
        mes,
        trabajadorId: trabajadorId || req.body?.trabajadorId,
        remuneracionMensualActual: req.body?.remuneracionMensualActual,
        fuentePrevios: req.body?.fuentePrevios || 'AUTO',
        certificadoQuinta: null,
        filialIdPreferida: req.body?.filialId ?? payloadCalculo?.filialId ?? null,
        contratoId: payloadCalculo?.contratoId ?? req.body?.contratoId ?? null,
        asignacion_familiar: !!req.body?.__tiene_asignacion_familiar,
        asignacion_familiar_desde: req.body?.__asignacion_familiar_desde || null,
        payloadCalculo,
        obtenerIngresosUC: obtenerIngresosUC,
        sinPrevRepo,
      });

      // 4) Aplicar DJ Sin Previos: sólo actúa si mes < aplica (total a 0). 
      payload = await aplicarSoportesPrevios({ dni, anio, mes, payload });

      console.log("PAYLOAD ENVIADO A CALCULAR EN PREVISUALIZAR: ", payload)

      // 5) Calcular
      const dto = await calcularUC.execute(payload);

      // Si somos secundarios la retención base del mes = 0
      if (soportes.meta.es_secundaria) {
        dto.retencion_base_mes = 0;
        dto.retencion_adicional_mes = 0;
      }

      console.log("DATOS RECIBIDOS DESPUES DE CALCULAR: ", dto)

      /* const aplicaQuinta = (dto.retencion_base_mes !== 0 || dto.retencion_adicional_mes !== 0);
      if (!aplicaQuinta) {
        const err = new Error("El trabajador no aplica retención de quinta categoría.");
        err.status = 400;
        throw err;
      } */ 

      // Entradas visibles al front 
      dto.entradas = {
        ...(dto.entradas || {}),
        remuneracion_mensual: remuneracionMensualActual,
        grati_julio_proj: base.gratiJulioProj,
        grati_diciembre_proj: base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otrosIngresosProj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
      }

      const paraGuardar = {
        ...dto,
        trabajador_id: trabajadorId,
        contrato_id: req.body.__contratoId,
        filial_id: filialActualId,
        dni, anio, mes,
        filial_retiene_id: soportes.meta.filial_retiene_id,
        origen_retencion: soportes.meta.origen_retencion,
        es_secundaria: soportes.meta.es_secundaria ? 1 : 0,
        ingresos_previos_internos: soportes.meta.ingresos_previos_internos,
        ingresos_previos_externos: soportes.meta.ingresos_previos_externos,
        retenciones_previas_externas: soportes.meta.retenciones_previas_externas,
        soporte_multiempleo_id: soportes.meta.soporte_multiempleo_id,
        soporte_certificado_id: soportes.meta.soporte_certificado_id,
        soporte_sin_previos_id: soportes.meta.soporte_sin_previos_id,
        soportes_json: soportes.meta.soportes_json
      }

      // Adjuntar soportes al payload de respuesta (con URLs absolutas si existen)
      const multi = soportes.multiEmpleoOk ? { ...soportes.multiEmpleoOk } : null;
      if (multi?.archivo_url) multi.archivo_url = absolutize(multi.archivo_url, req);
      const cert = soportes.certificadoOk ? { ...soportes.certificadoOk } : null;
      if (cert?.archivo_url) cert.archivo_url = absolutize(cert.archivo_url, req);
      const sp = soportes.sinPreviosOk ? { ...soportes.sinPreviosOk } : null;
      if (sp?.archivo_url) sp.archivo_url = absolutize(sp.archivo_url, req);

      const saved = await guardarUC.execute(paraGuardar, {
        esRecalculo: false,
        fuente: 'oficial',
        tramos_usados_json: {
          impuestoTotal: dto.impuesto_anual,
          tramos_usados: dto.tramos_usados
        }
      });

      return res.status(201).json({
        ok: true,
        data: {
          ...(saved.toJSON?.() ?? saved),
          ingresos_previos: base,
          retencion_meta: soportes.meta,
          soportes: { 
            certificado: cert, 
            multiempleo: multi, 
            sinPrevios: sp 
          }
        }
      });

    } catch (error) {
      console.error("Error al crear registro de quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al calcular la retención de quinta categoría."
      });
    }
  },

  async recalcular(req, res) {
    try {
      console.log("REQUEST PARA RECALCULAR QUE VIENE DEL FRONT: ", req.body);

      const error = await enriquecerConContratoOFalla(req);
      if (error) return res.status(error.status).json({ ok: false, message: error.message });

      const prev = await repo.findById(req.params.id);
      if (!prev) return res.status(404).json({ ok: false, message: 'No encontrado' });

      console.log("PREVIO ENCONTRADO PARA RECALCULAR: ", prev.toJSON());

      const filialActualId = Number(req.body.__filialId);
      const { dni } = req.body;
      const anio = Number(req.body.anio);
      const mes  = Number(req.body.mes);

      const contratoId   = Number(req.body.contratoId);
      const trabajadorId = Number(req.body.__trabajadorId || req.body.trabajadorId);

      // Normaliza fuente
      const fuentePrevios = String(req.body.fuentePrevios || 'AUTO').toUpperCase();

      // CLAVE: nombre correcto que el UC espera
      const remuneracionMensualActual = Number(req.body.remuneracionMensualActual || 0);

      // 1) LEER SOPORTES PRIMERO
      const djSinPrevios = await sinPrevRepo.obtenerPorDniAnio({ dni, anio });
      const sinPreviosAplicaDesde = Number(djSinPrevios?.aplica_desde_mes || 0) || null;

      // 2) BASE de ingresos previos (recortada si aplica)
      const obtenerPrevUC = new ObtenerIngresosPrevios();
      let base = await obtenerPrevUC.execute({
        trabajadorId,
        dni,
        anio,
        mes,
        remuneracionMensualActual,
        fuentePrevios,
        certificadoQuinta: req.body.certificadoQuinta || null,
        filialIdPreferida: filialActualId,
        contratoId,
        asignacion_familiar: req.body.__tiene_asignacion_familiar || false,
        asignacion_familiar_desde: req.body.__asignacion_familiar_desde || "",
        sinPreviosAplicaDesde 
      });

      // consultamos retenciones previas (regla “vigente por mes”)
      const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
        trabajadorId,
        anio,
        mes,
      });

      console.log("RETENCIÓN TOTAL EN BASE DE DATOS SACADA DE BUILD: ", retPreviasDB)

      // suma de certificado solo si la fuente es CERTIFICADO
      const retencionesPrevias =
        Number(retPreviasDB || 0) +
        (req.body?.fuentePrevios === 'CERTIFICADO'
          ? Number(req.body?.certificadoQuinta?.retenciones_previas || 0)
          : 0);
        
      console.log("RETENCIÓN TOTAL SUMANDO LAS DEL CERTIFICADO: ", retencionesPrevias)
      
      const esProyeccion = !!base.es_proyeccion;

      // Defensa: jamás dejar base undefined
      if (!base || typeof base !== 'object') {
        base = {
          remuneraciones: 0, gratificaciones: 0, bonos: 0,
          asignacion_familiar: 0, gratiJulioTrabajador: 0,
          gratiJulioProj: 0, gratiDiciembreTrabajador: 0,
          gratiDiciembreProj: 0, extraGravadoMes: 0,
          es_proyeccion: false, total_ingresos: 0
        };
      }
      console.log("BASE INICIAL EN PREVISUALIZAR (recortada si DJ aplica): ", base);

      // Consolidar soportes efectivos por mes
      const soportes = await _leerSoportesEfectivos({
        dni, anio: Number(anio), mes: Number(mes), filialId: filialActualId
      });
      console.log("RESPUESTA DE SOPORTES EN PREVISUALIZAR: ", soportes)

      // 3) Payload de cálculo
      let payload = {
        dni,
        trabajadorId,
        anio,
        mes,
        contratoId,
        remuneracionMensualActual,
        ingresos_previos_internos: Number(soportes.ingresosPrevios || 0),
        retenciones_previas_internas: soportes.saltarRetener ? 0 : Number(soportes.retPrevias || 0),
        ingresosPrevios: base,
        retencionesPrevias: retencionesPrevias, 
        esProyeccion: esProyeccion,
        fuentePrevios,
        otrosIngresosProyectados: Number(req.body.otrosIngresosProj || 0),
      };

      // 4) Aplicar DJ Sin Previos: sólo actúa si mes < aplica (total a 0). 
      payload = await aplicarSoportesPrevios({ dni, anio, mes, payload });

      console.log("PAYLOAD ENVIADO A CALCULAR EN PREVISUALIZAR: ", payload)

      // 5) Calcular
      const dto = await calcularUC.execute(payload);

      // Si somos secundarios la retención base del mes = 0
      if (soportes.meta.es_secundaria) {
        dto.retencion_base_mes = 0;
        dto.retencion_adicional_mes = 0;
      }

      // Entradas visibles al front 
      dto.entradas = {
        ...(dto.entradas || {}),
        remuneracion_mensual: remuneracionMensualActual,
        grati_julio_proj: base.gratiJulioProj,
        grati_diciembre_proj: base.gratiDiciembreProj,
        otros_ingresos_proj: Number(req.body.otros_ingresos_proj || 0),
        extra_gravado_mes: Number(req.body.extra_gravado_mes || 0),
      };

      // 10) Persistir el recálculo (sólo UPDATE; no recalcular de nuevo)
      const paraGuardar = await recalcularUC.execute({
        id: req.params.id,
        overrideInput: {
          ...dto,
          trabajador_id: trabajadorId,
          filial_id: filialActualId,
          dni, anio, mes,
          filial_retiene_id: soportes.meta.filial_retiene_id,
          origen_retencion: soportes.meta.origen_retencion,
          es_secundaria: soportes.meta.es_secundaria ? 1 : 0,
          ingresos_previos_internos: soportes.meta.ingresos_previos_internos,
          ingresos_previos_externos: soportes.meta.ingresos_previos_externos,
          retenciones_previas_externas: soportes.meta.retenciones_previas_externas,
          soporte_multiempleo_id: soportes.meta.soporte_multiempleo_id,
          soporte_certificado_id: soportes.meta.soporte_certificado_id,
          soporte_sin_previos_id: soportes.meta.soporte_sin_previos_id,
          soportes_json: soportes.meta.soportes_json,
        },
        creadoPor: req.user?.id
      });

      // Adjuntar soportes al payload de respuesta (con URLs absolutas si existen)
      const multi = soportes.multiEmpleoOk ? { ...soportes.multiEmpleoOk } : null;
      if (multi?.archivo_url) multi.archivo_url = absolutize(multi.archivo_url, req);
      const cert = soportes.certificadoOk ? { ...soportes.certificadoOk } : null;
      if (cert?.archivo_url) cert.archivo_url = absolutize(cert.archivo_url, req);
      const sp = soportes.sinPreviosOk ? { ...soportes.sinPreviosOk } : null;
      if (sp?.archivo_url) sp.archivo_url = absolutize(sp.archivo_url, req);

      return res.status(201).json({
        ok: true,
        data: {
          ...(paraGuardar.toJSON?.() ?? paraGuardar),
          ...dto,
          ingresos_previos: base,
          retencion_meta: soportes.meta,
          soportes: { certificado: cert, multiempleo: multi, sinPrevios: sp },
        }
      });

    } catch (error) {
      console.error("Error en el recálculo de quinta categoría:", error);
      return res.status(error.status || 500).json({
        ok: false,
        message: error.message || "Error interno al recalcular la retención de quinta categoría."
      });
    }
  },

  async getById(req, res) {
    try {
      //console.log("LLEGUÉ AQUÍ CON EL REQUEST: ", req)
      // Buscamos en el repo un cálculo de quinta categoría por su id
      const row = await repo.findById(req.params.id);
      // Si no existe respondemos el error
      if (!row) return res.status(404).json({ ok: false, message: 'No encontrado' });
      // Si existe, lo enviamos
      return res.json({ ok: true, data: row });
    } catch (error) {
      console.error("Error buscando el cálculo de quinta categoría:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno al buscar el cálculo de quinta categoría."
      });
    }
  },

  async list(req, res) {
    try {
      // Extraemos los parámetros de la solicitud
      const { dni, anio, page, limit } = req.query;

      // Llamamos al repositorio para obtener el listado
      const response = await repo.list({ 
        dni, // Para filtrar por trabajador
        anio: anio ? Number(anio) : undefined, // Para filtrar por año
        page: Number(page) || 1, // Por defecto pagina 1
        limit: Number(limit) || 20 // Por defecto 20 filas por pagina
      });

      // Devolvemos la respuesta json con datos paginados
      return res.json({ ok: true, ...response });

    } catch (error) {
      console.error("Error listando los cálculos de quinta categoría:", error);

      return res.status(500).json({
        ok: false,
        message: "Error interno listando los cálculos de quinta categoría."
      });
    }
  },

  async getRetencionBaseMesPorDni(req, res) {
    try {
      const { dni, anio, mes } = req.query || {};
      const out = await obtenerBaseMesUC.execute({ dni, anio: Number(anio), mes: Number(mes) });
      return res.status(200).json({ ok: true, ...out });
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({ ok: false, message: err.message || "Error interno al consultar retención base del trabajador"})
    }
  },
};