const moment = require("moment");

/**
 * Devuelve los meses computables para la gratificación trunca
 * @param {string} fechaInicioContrato - YYYY-MM-DD
 * @param {string} fechaBaja - YYYY-MM-DD
 * @returns {Object} { mesesComputados, fechaInicioPeriodo, fechaFinPeriodo }
 */
function calcularMesesComputadosGratificacion(fechaInicioContrato, fechaBaja) {
  const inicioContrato = moment(fechaInicioContrato, "YYYY-MM-DD");
  const baja = moment(fechaBaja, "YYYY-MM-DD");

  const mesBaja = baja.month() + 1;
  const anioBaja = baja.year();

  // 1. Fecha de inicio del semestre de grati
  let inicioSemestre;
  if (mesBaja <= 6) {
    inicioSemestre = moment(`${anioBaja}-01-01`, "YYYY-MM-DD");
  } else {
    inicioSemestre = moment(`${anioBaja}-07-01`, "YYYY-MM-DD");
  }

  // 2. Fecha efectiva de inicio
  const inicioEfectivo = moment.max(inicioContrato, inicioSemestre);

  // 3. Revisar mes por mes si fue trabajado completo
  let mesesComputados = 0;
  let cursor = inicioEfectivo.clone().startOf("month");

  while (cursor.isSameOrBefore(baja, "month")) {
    const inicioMes = cursor.clone().startOf("month");
    const finMes = cursor.clone().endOf("month");

    if (inicioEfectivo.isSameOrBefore(inicioMes, "day") &&
        baja.isSameOrAfter(finMes, "day")) {
      mesesComputados++;
    }

    cursor.add(1, "month");
  }

  return {
    mesesComputados,
    fechaInicioPeriodo: inicioEfectivo.format("YYYY-MM-DD"),
    fechaFinPeriodo: baja.format("YYYY-MM-DD"),
  };
}

module.exports = { calcularMesesComputadosGratificacion };
