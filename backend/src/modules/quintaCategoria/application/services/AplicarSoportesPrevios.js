const SequelizeDeclaracionSinPreviosRepository = require('../..//infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
const sinPrevRepo = new SequelizeDeclaracionSinPreviosRepository();

/**
 * Regla actual:
 *   Si existe DJ "Sin Previos" VIGENTE y MES ANTERIOR (mes < aplica_desde_mes),
 *     - previos en el payload (tanto acumulados como internos/Externos a 0)
 *     - fuentePrevios = 'SIN_PREVIOS'
 * si mes >= aplica_desde_mes no borramos aquí 
 *  Si no aplica, no toca nada
 */
async function aplicarSoportesPrevios({ dni, anio, mes, payload }) {
  const declaracionJurada = await sinPrevRepo.obtenerPorDniAnio({
    dni,
    anio: Number(anio) || 0,
  });
  const m = Number(mes) || 0;
  const aplica = Number(declaracionJurada?.aplica_desde_mes || 0);
  if(!declaracionJurada || !aplica) return payload;

  payload._sinPreviosAplicaDesde = aplica;
  payload._soporteSinPrevios = {
      id: declaracionJurada.id,      
      aplica_desde_mes: aplica,
      archivo_url: declaracionJurada.archivo_url || null,
      observaciones: declaracionJurada.observaciones || null,
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
  return payload;
}

module.exports = { aplicarSoportesPrevios };