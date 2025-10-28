const restarInventarioYDetectarFaltantes = (
  despiece_base = [],
  sumatoria_piezas = []
) => {
  const mapa = new Map();
  const no_encontradas = [];

  // Mapear el despiece base por pieza_id
  despiece_base.forEach((item) => {
    mapa.set(item.pieza_id, { ...item });
  });

  // Restar las cantidades según la sumatoria
  sumatoria_piezas.forEach((item) => {
    if (mapa.has(item.pieza_id)) {
      mapa.get(item.pieza_id).cantidad -= item.cantidad;
    } else {
      // Agregar al listado de piezas no encontradas
      no_encontradas.push({ ...item });
    }
  });

  const resta = Array.from(mapa.values());

  return { resta, no_encontradas };
};

module.exports = restarInventarioYDetectarFaltantes;
