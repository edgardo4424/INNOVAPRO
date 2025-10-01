/**
 * Ajusta los meses computados restando las faltas
 * @param {number} mesesComputados - Meses completos computados
 * @param {number} faltas - Días de faltas
 * @returns {Object} { meses, dias }
 */
function ajustarMesesPorFaltas(mesesComputados, faltas) {
  // 1. Pasar a días
  let totalDias = mesesComputados * 30;

  // 2. Restar faltas
  totalDias -= faltas;
  if (totalDias < 0) totalDias = 0;

  // 3. Convertir a meses + días
  const meses = Math.floor(totalDias / 30);
  const dias = totalDias % 30;

  return { meses, dias };
}

module.exports = { ajustarMesesPorFaltas };