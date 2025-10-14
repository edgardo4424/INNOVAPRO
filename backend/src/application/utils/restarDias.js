const moment = require("moment");

/**
 * Resta días a un tiempo expresado en años, meses y días
 * @param {Object} tiempo - { anios, meses, dias }
 * @param {number} diasARestar - cantidad de días a restar
 * @returns {Object} - { anios, meses, dias } recalculado
 */
function restarDias(tiempo, diasARestar) {
  const fechaInicio = moment("2000-01-01");

  // sumar tiempo inicial
  let fechaFin = fechaInicio
    .clone()
    .add(tiempo.anios, "years")
    .add(tiempo.meses, "months")
    .add(tiempo.dias, "days");

  // restar días
  fechaFin = fechaFin.subtract(diasARestar, "days");

  // ahora calcular diferencia exacta en Y-M-D (calendar-based)
  const anios = fechaFin.diff(fechaInicio, "years");
  fechaInicio.add(anios, "years");

  const meses = fechaFin.diff(fechaInicio, "months");
  fechaInicio.add(meses, "months");

  const dias = fechaFin.diff(fechaInicio, "days");

  return { anios, meses, dias };
}

module.exports = { restarDias };