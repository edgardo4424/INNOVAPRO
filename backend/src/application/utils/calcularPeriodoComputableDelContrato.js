const moment = require("moment");

/**
 * Calcula el periodo computable (años, meses, días) considerando días no computables.
 * Usa calendario real (moment).
 */
function calcularPeriodoComputableDelContrato(contrato, diasNoComputables = 0) {
  const inicio = moment(contrato.fecha_inicio, "YYYY-MM-DD");
  const fin = contrato.fecha_terminacion_anticipada
    ? moment(contrato.fecha_terminacion_anticipada, "YYYY-MM-DD")
    : moment(contrato.fecha_fin, "YYYY-MM-DD");

  // ✅ Incluir último día trabajado
  const finIncluido = fin.clone().add(1, "day");

  // Calcular años, meses y días con calendario real
  const temp = inicio.clone();

  let anios = finIncluido.diff(temp, "years");
  temp.add(anios, "years");

  let meses = finIncluido.diff(temp, "months");
  temp.add(meses, "months");

  let dias = finIncluido.diff(temp, "days");

  // ✅ Restar días no computables
  dias -= diasNoComputables;

  // Normalizar si los días quedaron negativos
  while (dias < 0) {
    if (meses > 0) {
      meses -= 1;
      dias += temp.subtract(1, "month").daysInMonth(); // sumamos los días del mes anterior
      temp.add(1, "month"); // volver al mes original
    } else if (anios > 0) {
      anios -= 1;
      meses += 11;
      dias += 30; // aprox, puedes ajustar según días reales de mes
    } else {
      dias = 0; // no puede quedar negativo en total
    }
  }

  // Normalizar meses
  if (meses >= 12) {
    anios += Math.floor(meses / 12);
    meses = meses % 12;
  }

  return {
    periodoComputable: { anios, meses, dias }
  };
}

module.exports = { calcularPeriodoComputableDelContrato };
