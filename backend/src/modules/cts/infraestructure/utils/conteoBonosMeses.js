const conteoBonosMeses = (bonos) => {
  const tiposPorMes = new Map();
  for (const bono of bonos) {
    if (bono.tipo !== "extraordinario") {
      const mes = bono.fecha.substring(0, 7); // 'YYYY-MM' para evitar colisiones entre años
      if (!tiposPorMes.has(mes)) {
        tiposPorMes.set(mes, new Set());
      }
      tiposPorMes.get(mes).add(bono.tipo);
    }
  }

  // Contar en cuántos meses aparece cada tipo de bono
  const conteoTipoEnMeses = new Map();

  for (const tipos of tiposPorMes.values()) {
    for (const tipo of tipos) {
      conteoTipoEnMeses.set(tipo, (conteoTipoEnMeses.get(tipo) || 0) + 1);
    }
  }

  // Filtrar tipos que aparecen en al menos 3 meses distintos
  const tiposValidos = [];
  for (const [tipo, cantidadMeses] of conteoTipoEnMeses.entries()) {
    if (cantidadMeses >= 3) {
      tiposValidos.push(tipo);
    }
  }
  return tiposValidos;
};

module.exports = conteoBonosMeses;
