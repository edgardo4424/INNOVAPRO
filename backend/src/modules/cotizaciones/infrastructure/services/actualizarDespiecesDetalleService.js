async function actualizarDespiecesDetalle({ despiece_id, despiece, transaction  }) {
  // 1. Traer las piezas actuales
  const piezasActuales = await db.despieces_detalle.findAll({
    where: { despiece_id },
    raw: true,
  });

  // 2. Construir claves únicas para comparar (solo pieza_id)
  const clave = (pieza) => `${pieza.pieza_id}`;
  const clavesActuales = piezasActuales.map(clave);
  const clavesNuevas = despiece.map(clave);

  // 3. Detectar qué claves eliminar
  const clavesAEliminar = clavesActuales.filter(c => !clavesNuevas.includes(c));

  // 4. Borrar registros que no estén en la nueva lista
  if (clavesAEliminar.length > 0) {
    await db.despieces_detalle.destroy({
      where: {
        despiece_id,
        pieza_id: clavesAEliminar
      },
      transaction 
    });
  }

  // 5. Insertar o actualizar las piezas nuevas
  await db.despieces_detalle.bulkCreate(despiece.map((d) => ({
    ...d,
    despiece_id
  })), {
    updateOnDuplicate: [
      'despiece_id',
      'pieza_id',
      'cantidad',
      'peso_kg',
      'precio_venta_dolares',
      'precio_venta_soles',
      'precio_alquiler_soles'
      // 👈 aquí coloca todos los campos que tenga tu tabla, excepto "id"
    ],
    transaction 
  });
}

module.exports = { actualizarDespiecesDetalle };