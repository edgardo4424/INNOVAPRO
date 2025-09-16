const moment = require("moment");

/**
 * Calcula el periodo computable (años, meses, días) considerando días no computables.
 * Usa calendario real (moment).
 */
function calcularPeriodoComputableDelContrato(contrato, diasNoComputables = 0) {
  const inicio = moment(contrato.fecha_inicio, "YYYY-MM-DD");
  const fin = (
    contrato.fecha_terminacion_anticipada
      ? moment(contrato.fecha_terminacion_anticipada, "YYYY-MM-DD")
      : moment(contrato.fecha_fin, "YYYY-MM-DD")
  ).add(1, "day"); // ✅ incluye el último día

  let diasTotales = fin.diff(inicio, "days"); // Total real
  let diasComputables = Math.max(diasTotales - diasNoComputables, 0);

  const base = moment("2000-01-01");
  const resultado = base.clone().add(diasComputables, "days");

  const anios = resultado.diff(base, "years");
  base.add(anios, "years");

  const meses = resultado.diff(base, "months");
  base.add(meses, "months");

    const dias = resultado.diff(base, "days") + 1; // ✅ suma 1 día final

  return {
    periodoComputable: { anios, meses, dias },
  };
}

module.exports = { calcularPeriodoComputableDelContrato };
