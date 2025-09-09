const SequelizeDeclaracionSinPreviosRepository = require('../..//infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');
const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');

const sinPrevRepo = new SequelizeDeclaracionSinPreviosRepository();
const multiRepo   = new SequelizeDeclaracionMultiempleoRepository();
const certRepo    = new SequelizeCertificadoQuintaRepository();
/**
 * Efectos:
 *  - Sin Previos:
 *      mes < aplica → zerea todo y fija fuente = SIN_PREVIOS
 *      mes >= aplica → deja base; recorte fino ya lo hace ObtenerIngresosPrevios por corte
 *  - Multiempleo:
 *      mes >= aplica → marca meta y, si es_secundaria=true, _saltarRetener = true
 *  - Certificado:
 *      Sólo metadata; si el front selecciona FUENTE "CERTIFICADO", el controller pasará el certificado al UC.
 */
async function aplicarSoportesPrevios({ dni, anio, mes, payload }) {
  const m = Number(mes) || 0;

  // Sin Previos
  const declaracionJuradaSP = await sinPrevRepo.obtenerPorDniAnio({
    dni,
    anio: Number(anio) || 0,
  });
  const aplica = Number(declaracionJuradaSP?.aplica_desde_mes || 0);
  if(!declaracionJuradaSP || !aplica) return payload;

  payload._sinPreviosAplicaDesde = aplica;
  payload._soporteSinPrevios = {
      id: declaracionJuradaSP.id,      
      aplica_desde_mes: aplica,
      archivo_url: declaracionJuradaSP.archivo_url || null,
      observaciones: declaracionJuradaSP.observaciones || null,
  };
  
  if ( m < aplica ) {
    payload.fuentePrevios = 'SIN_PREVIOS';
    payload.retencionesPrevias = 0;
    payload.ingresosPrevios = {
      remuneraciones: 0,
      gratificaciones: 0,
      bonos: 0,
      asignacion_familiar: 0,
      gratiJulioTrabajador: 0,
      gratiJulioProj: 0,
      gratiDiciembreTrabajador: 0,
      gratiDiciembreProj: 0,
      extraGravadoMes: 0,
      es_proyeccion: false,
      remu_multi: null,
      grati_multi: null,
      af_multi: null,
      total_ingresos: 0,
    };
    console.log(`[DJ SinPrevios] Recorte total aplicado ← aplica=${aplica}, mes=${m}`);
  } else {
    console.log(`[DJ SinPrevios] Vigente desde mes=${aplica} (m=${m}). Recorte fino lo hará ObtenerIngresosPrevios.`);
  }

  // === MULTIEMPLEO ===
  const declaracionJuradaMP = await multiRepo.obtenerPorDniAnio({ dni, anio: Number(anio) || 0 });
  const aplicaME = Number(declaracionJuradaMP?.aplica_desde_mes || 0);
  if (declaracionJuradaMP?.id) {
    payload._soporteMultiempleo = {
      id: declaracionJuradaMP.id,
      aplica_desde_mes: aplicaME || null,
      es_secundaria: !!declaracionJuradaMP.es_secundaria,
      principal_ruc: declaracionJuradaMP.principal_ruc || null,
      principal_nombre: declaracionJuradaMP.principal_nombre || null,
      archivo_url: declaracionJuradaMP.archivo_url || null,
      observaciones: declaracionJuradaMP.observaciones || null,
    };
    if (aplicaME && m >= aplicaME && declaracionJuradaMP.es_secundaria) {
      payload._saltarRetener = true; // el controller lo aplicará después del cálculo
      console.log(`[DJ Multiempleo] Somos SECUNDARIA desde m=${aplicaME}. Saltar retención base.`);
    }
  }

  // === CERTIFICADO (solo meta acá) ===
  const certificado = await certRepo.obtenerPorDniAnio({ dni, anio: Number(anio) || 0 });
  if (certificado?.id) {
    payload._soporteCertificado = {
      id: certificado.id,
      empresa_ruc: certificado.empresa_ruc || null,
      empresa_nombre: certificado.empresa_nombre || null,
      renta_bruta_total: Number(certificado.renta_bruta_total || 0),
      remuneraciones: Number(certificado.remuneraciones || 0),
      gratificaciones: Number(certificado.gratificaciones || 0),
      otros: Number(certificado.otros || 0),
      asignacion_familiar: Number(certificado.asignacion_familiar || 0),
      retenciones_previas: Number(certificado.retenciones_previas || 0),
      fecha_emision: certificado.fecha_emision || null,
      archivo_url: certificado.archivo_url || null
    };
  }

  return payload;
}

module.exports = { aplicarSoportesPrevios };