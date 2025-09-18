const SequelizeDeclaracionSinPreviosRepository = require('../..//infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const SequelizeDeclaracionMultiempleoRepository = require('../../infrastructure/repositories/SequelizeDeclaracionMultiempleoRepository');
const SequelizeCertificadoQuintaRepository = require('../../infrastructure/repositories/SequelizeCertificadoQuintaRepository');

const sinPrevRepo = new SequelizeDeclaracionSinPreviosRepository();
const multiRepo   = new SequelizeDeclaracionMultiempleoRepository();
const certRepo    = new SequelizeCertificadoQuintaRepository();

async function aplicarSoportesPrevios({ dni, anio, mes, payload }) {
  // Sin Previos
  const declaracionJuradaSP = await sinPrevRepo.obtenerPorDniAnio({
    dni,
    anio,
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
  
  if ( mes < aplica ) {
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
    console.log(`[DJ SinPrevios] Recorte total aplicado ← aplica=${aplica}, mes=${mes}`);
  } else {
    console.log(`[DJ SinPrevios] Vigente desde mes=${aplica} (mes=${mes}). Recorte fino lo hará ObtenerIngresosPrevios.`);
  }

  // === MULTIEMPLEO ===
  const declaracionJuradaMP = await multiRepo.obtenerPorDniAnio({ dni, anio });
  const aplicaME = Number(declaracionJuradaMP?.aplica_desde_mes || 0);
  if (declaracionJuradaMP?.id) {
    payload._soporteMultiempleo = {
      id: declaracionJuradaMP.id,
      aplica_desde_mes: aplicaME || null,
      es_secundaria: !!declaracionJuradaMP.es_secundaria,
      principal_ruc: declaracionJuradaMP.principal_ruc || null,
      principal_razon_social: declaracionJuradaMP.principal_razon_social || null,
      archivo_url: declaracionJuradaMP.archivo_url || null,
      observaciones: declaracionJuradaMP.observaciones || null,
    };
    if (aplicaME && mes >= aplicaME && declaracionJuradaMP.es_secundaria) {
      payload._saltarRetener = true; // el controller lo aplicará después del cálculo
      console.log(`[DJ Multiempleo] Somos SECUNDARIA desde mes=${aplicaME}. Saltar retención base.`);
    }
  }

  // === CERTIFICADO (solo meta acá) ===
  const certificado = await certRepo.obtenerPorDniAnio({ dni, anio });
  if (certificado?.id) {
    payload._soporteCertificado = {
      id: certificado.id,
      aplica_desde_mes: certificado.aplica_desde_mes ? Number(certificado.aplica_desde_mes) : null,
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

module.exports = { 
  aplicarSoportesPrevios,
};