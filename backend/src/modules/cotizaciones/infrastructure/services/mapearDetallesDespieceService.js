
function mapearDetallesDespiece({despiece, despiece_id}){
    return despiece.map(pieza => ({
    despiece_id,
    pieza_id: pieza.pieza_id,
    cantidad: parseFloat(pieza.total),
    peso_kg: parseFloat(pieza.peso_kg),
    precio_venta_dolares: parseFloat(pieza.precio_venta_dolares),
    precio_venta_soles: parseFloat(pieza.precio_venta_soles),
    precio_alquiler_soles: parseFloat(pieza.precio_alquiler_soles),
    uuid: pieza?.uuid || null
  }));
}

module.exports = { mapearDetallesDespiece };