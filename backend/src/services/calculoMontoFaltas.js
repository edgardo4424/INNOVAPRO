function contarDiasLaborablesDelMes(anio, mes /* 1-12 */) {
  const m0 = mes - 1;
  if (m0 < 0 || m0 > 11) throw new Error('mes debe ser 1..12');

  let contador = 0;
  const fecha = new Date(Date.UTC(anio, m0, 1));
  while (fecha.getUTCMonth() === m0) {
    const dia = fecha.getUTCDay(); // 0=dom, 6=sáb
    if (dia !== 0 && dia !== 6) contador++;
    fecha.setUTCDate(fecha.getUTCDate() + 1);
  }
  return contador;
}

/**
 * Calcula monto total de faltas en un rango, teniendo en cuenta los días laborables por mes.
 * @param {Object} params
 * @param {string | Date} params.fechaInicio - Fecha inicio (inclusive)
 * @param {string | Date} params.fechaFin - Fecha fin (inclusive)
 * @param {number} params.sueldoBase - Sueldo mensual
 * @param {string[]} params.faltas - Array de fechas 'YYYY-MM-DD' en las que hubo faltas
 * @returns {Object} resultado con total y desglose por mes
 */
function calcularMontoFaltasPorRango({ fechaInicio, fechaFin, sueldoBase, faltas = [] }) {

    console.log('faltaaaaaaaaaas', faltas);
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const faltasValidas = [];

  for (const f of faltas) {
    const d = new Date(f);
    if (d >= inicio && d <= fin && d.getUTCDay() !== 0 && d.getUTCDay() !== 6) {
      faltasValidas.push(d);
    }
  }

  // Agrupar por año-mes
  const agrupadas = {};
  for (const d of faltasValidas) {
    const anio = d.getUTCFullYear();
    const mes = d.getUTCMonth() + 1; // 1-12
    const clave = `${anio}-${mes.toString().padStart(2, '0')}`;
    agrupadas[clave] = (agrupadas[clave] || 0) + 1;
  }

  let total = 0;
  const detalle = [];

  for (const clave in agrupadas) {
    const [anio, mes] = clave.split('-').map(Number);
    const faltasDelMes = agrupadas[clave];
    const diasLaborables = contarDiasLaborablesDelMes(anio, mes);
    if (diasLaborables === 0) continue;

    const montoPorDia = sueldoBase / diasLaborables;
    const descuento = +(faltasDelMes * montoPorDia).toFixed(2);
    total += descuento;

    detalle.push({
      mes: clave,
      faltas: faltasDelMes,
      diasLaborables,
      montoPorDia: +montoPorDia.toFixed(2),
      descuento
    });
  }

  return {
    total: +total.toFixed(2),
    detalle
  };
}

module.exports = {
  contarDiasLaborablesDelMes,
  calcularMontoFaltasPorRango
};
