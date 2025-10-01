/**
 * Ajusta los meses y días computados de CTS restando las faltas
 * @param {number} meses - Meses computados (en base a 30 días)
 * @param {number} dias - Días computados sueltos
 * @param {number} faltas - Días de faltas injustificadas
 * @returns {Object} { meses, dias }
 */
function ajustarMesesDiasPorFaltasCTS(meses, dias, faltas) {
  // 1. Convertir a días base 30
  let totalDias = meses * 30 + dias;

  // 2. Restar faltas
  totalDias -= faltas;
  if (totalDias < 0) totalDias = 0;

  // 3. Reconvertir a meses + días (base 30)
  const mesesAjustados = Math.floor(totalDias / 30);
  const diasAjustados = totalDias % 30;

  return { meses: mesesAjustados, dias: diasAjustados };
}

module.exports = { ajustarMesesDiasPorFaltasCTS };
