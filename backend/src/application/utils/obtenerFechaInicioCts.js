const moment = require("moment");

/**
 * Calcula la fecha de inicio del periodo CTS según la fecha de baja
 * y la fecha de ingreso del trabajador
 * @param {moment} fechaBaja - Fecha de baja
 * @param {string} fechaIngresoStr - Fecha de ingreso del trabajador (YYYY-MM-DD)
 * @returns {string} fechaInicioCts (YYYY-MM-DD)
 */
function obtenerFechaInicioCts(fechaBajaStr, fechaIngresoStr) {
  const fechaBaja = moment(fechaBajaStr, "YYYY-MM-DD"); // 👈 parseamos aquí
  const mes = fechaBaja.month() + 1; // moment meses 0-11
  const anio = fechaBaja.year();

  let fechaInicioPeriodo;

  if (mes >= 5 && mes <= 10) {
    // Mayo a octubre → periodo vigente empezó en mayo
    fechaInicioPeriodo = moment(`${anio}-05-01`, "YYYY-MM-DD");
  } else {
    // Noviembre a abril → periodo vigente empezó en noviembre
    if (mes >= 11) {
      fechaInicioPeriodo = moment(`${anio}-11-01`, "YYYY-MM-DD");
    } else {
      // enero a abril → corresponde a noviembre del año anterior
      fechaInicioPeriodo = moment(`${anio - 1}-11-01`, "YYYY-MM-DD");
    }
  }

  // comparar contra fecha real de ingreso (usar la mayor)
  const fechaIngreso = moment(fechaIngresoStr, "YYYY-MM-DD");
  const inicioEfectivo = moment.max(fechaInicioPeriodo, fechaIngreso);

  return inicioEfectivo.format("YYYY-MM-DD");
}

module.exports = { obtenerFechaInicioCts };
