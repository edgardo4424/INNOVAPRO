const db = require("../../../../models");
const { mapearDetallesDespiece } = require("./mapearDetallesDespieceService");

async function actualizarDespiecesDetalle({ despiece_id, despiece, transaction }) {
  if (!despiece || despiece.length === 0) {
    console.log("⚠️ No hay piezas para actualizar");
    return;
  }

  const piezasActuales = await db.despieces_detalle.findAll({
    where: { despiece_id },
    raw: false, // importante: queremos modelos con `.update()`
  });

  const clavesActuales = piezasActuales.map(p => `${p.pieza_id}_${p.esAdicional}`);
  const clavesNuevas = despiece.map(p => `${p.pieza_id}_${p.esAdicional}`);

  // 1️⃣ Eliminar las que ya no vienen del frontend
  const piezasAEliminar = piezasActuales.filter(p =>
    !clavesNuevas.includes(`${p.pieza_id}_${p.esAdicional}`)
  );

  if (piezasAEliminar.length > 0) {
    await db.despieces_detalle.destroy({
      where: {
        despiece_id,
        [db.Sequelize.Op.or]: piezasAEliminar.map(p => ({
          pieza_id: p.pieza_id,
          esAdicional: p.esAdicional,
        })),
      },
      transaction,
    });
    console.log(`🗑️ Eliminadas ${piezasAEliminar.length} piezas`);
  }

  // 2️⃣ Recorrer cada nueva pieza
  for (const nuevaPieza of despiece) {
    const clave = `${nuevaPieza.pieza_id}_${nuevaPieza.esAdicional}`;

    const piezaExistente = piezasActuales.find(
      p => `${p.pieza_id}_${p.esAdicional}` === clave
    );

    if (piezaExistente) {

        console.log('nuevaPieza', nuevaPieza);
      // Ya existe, actualizarla
      await piezaExistente.update(
        {
          cantidad: nuevaPieza.total,
          peso_kg: nuevaPieza.peso_kg,
          precio_venta_dolares: nuevaPieza.precio_venta_dolares,
          precio_venta_soles: nuevaPieza.precio_venta_soles,
          precio_alquiler_soles: nuevaPieza.precio_alquiler_soles,
        },
        { transaction }
      );
    } else {
      // No existe, insertarla
      await db.despieces_detalle.create(
        {
          ...nuevaPieza,
          cantidad: nuevaPieza.total,
          despiece_id,
        },
        { transaction }
      );
    }
  }

  console.log("✅ Sincronización completa con preservación de IDs.");
}


module.exports = { actualizarDespiecesDetalle };
