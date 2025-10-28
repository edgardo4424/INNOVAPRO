const sumarPiezas = (listas = []) => {
  const mapa = new Map();

  listas
    .filter((lista) => Array.isArray(lista))
    .forEach((lista) => {
      lista.forEach((item) => {
        const cantidad = Math.trunc(Number(item.cantidad)); // convierte a entero

        if (!mapa.has(item.pieza_id)) {
          mapa.set(item.pieza_id, { ...item, cantidad });
        } else {
          const acumulado = mapa.get(item.pieza_id);
          acumulado.cantidad += cantidad;
        }
      });
    });

  return Array.from(mapa.values());
};

module.exports = sumarPiezas;
