const moment = require("moment");

/**
 * Calcula el tiempo total laborado a partir de contratos.
 * @param {Array} contratos - Lista de contratos del trabajador.
 * @returns {Object} - Tiempo total en años, meses y días.
 */
function calcularTiempoLaborado(contratos = []) {

  let totalAnios = 0;
  let totalMeses = 0;
  let totalDias = 0;

  for (const contrato of contratos) {
    const inicio = moment(contrato.fecha_inicio, "YYYY-MM-DD");
    const fin = (
      contrato.fecha_terminacion_anticipada
        ? moment(contrato.fecha_terminacion_anticipada, "YYYY-MM-DD")
        : moment(contrato.fecha_fin, "YYYY-MM-DD")
    ).add(1, "day"); // ✅ Incluir último día

    // Copiamos el inicio para hacer los cálculos sin afectar el original
    const temp = inicio.clone();

    const anios = fin.diff(temp, "years");
    temp.add(anios, "years");

    const meses = fin.diff(temp, "months");
    temp.add(meses, "months");

    const dias = fin.diff(temp, "days");

    totalAnios += anios;
    totalMeses += meses;
    totalDias += dias;
  }

  // Normalizar los días y meses
  if (totalDias >= 30) {
    totalMeses += Math.floor(totalDias / 30);
    totalDias = totalDias % 30;
  }
  if (totalMeses >= 12) {
    totalAnios += Math.floor(totalMeses / 12);
    totalMeses = totalMeses % 12;
  }

  return {
    tiempoLaborado: {
      anios: totalAnios,
      meses: totalMeses,
      dias: totalDias,
    }
  };
}

module.exports = { calcularTiempoLaborado };
