const moment = require("moment");

/**
 * Calcula la fecha de inicio del periodo de gratificación según la fecha de baja
 * y la fecha de ingreso del trabajador
 * @param {moment} fechaBaja - Fecha de baja
 * @param {string} fechaIngresoStr - Fecha de ingreso del trabajador (YYYY-MM-DD)
 * @returns {moment} fechaInicioGrati
 */
function obtenerFechaInicioGrati(fechaBaja, fechaIngresoStr) {
  console.log('fechaBaja', fechaBaja, 'fechaIngresoStr', fechaIngresoStr);
  const mes = fechaBaja.month() + 1; // moment meses van de 0 a 11
  const anio = fechaBaja.year();

  // inicio del semestre legal
  let fechaInicioPeriodo;
  if (mes >= 1 && mes <= 6) {
    fechaInicioPeriodo = moment(`${anio}-01-01`, "YYYY-MM-DD");
  } else {
    fechaInicioPeriodo = moment(`${anio}-07-01`, "YYYY-MM-DD");
  }

  // comparar contra fecha real de ingreso
  const fechaIngreso = moment(fechaIngresoStr, "YYYY-MM-DD");
  if (fechaIngreso.isAfter(fechaInicioPeriodo)) {
    fechaInicioPeriodo = fechaIngreso.clone();
  }

  return fechaInicioPeriodo.format("YYYY-MM-DD");
}

module.exports = { obtenerFechaInicioGrati };
