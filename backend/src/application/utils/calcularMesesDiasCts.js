const moment = require("moment");

/**
 * Calcula meses y días computables para CTS
 * Reglas: meses completos = 1 mes,
 * días parciales se acumulan y cada 30 días = 1 mes
 */
function calcularMesesDiasCTS(fechaInicioCtsStr, fechaBajaStr) {
  const inicio = moment(fechaInicioCtsStr, "YYYY-MM-DD");
  const fin = moment(fechaBajaStr, "YYYY-MM-DD");

  if (fin.isBefore(inicio, "day")) {
    return { meses: 0, dias: 0 };
  }

  let meses = 0;
  let dias = 0;

  let cursor = inicio.clone().startOf("month");

  while (cursor.isSameOrBefore(fin, "month")) {
    const inicioMes = cursor.clone().startOf("month");
    const finMes = cursor.clone().endOf("month");

    if (inicio.isSameOrBefore(inicioMes, "day") && fin.isSameOrAfter(finMes, "day")) {
      // trabajó todo el mes
      meses++;
    } else if (
      inicio.isSameOrBefore(finMes, "day") && fin.isSameOrAfter(inicioMes, "day")
    ) {
      // días parciales
      const desde = moment.max(inicio, inicioMes);
      const hasta = moment.min(fin, finMes);

      dias += hasta.diff(desde, "days") + 1; // +1 porque es inclusivo
    }

    cursor.add(1, "month");
  }

  // 📌 Convertir días acumulados en meses (base 30)
  if (dias >= 30) {
    meses += Math.floor(dias / 30);
    dias = dias % 30;
  }

  return { meses, dias };
}

module.exports = { calcularMesesDiasCTS };
