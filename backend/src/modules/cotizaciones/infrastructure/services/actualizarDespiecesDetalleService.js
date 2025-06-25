const db = require("../../../../models");
const { mapearDetallesDespiece } = require("./mapearDetallesDespieceService");

async function actualizarDespiecesDetalle({ despiece_id, despiece, transaction }) {
  // 1️⃣ Filtrar las piezas adicionales que vienen del front
  const piezasNuevasAdicionales = despiece.filter(d => d.esAdicional === true);

  if (piezasNuevasAdicionales.length === 0) {
    console.log("⚠️ No hay piezas adicionales para actualizar");
    return;
  }

  // 2️⃣ Obtener todas las piezas actuales del despiece
  const piezasActuales = await db.despieces_detalle.findAll({
    where: { despiece_id },
    raw: true,
  });

  // 3️⃣ Detectar las pieza_id de piezas adicionales nuevas y actuales
  const piezasIdsDelFront = despiece.map(p=>p.pieza_id)
  const nuevasIds = piezasNuevasAdicionales.map(p => p.pieza_id);
  const actualesIds = piezasActuales.map(p => p.pieza_id);

  console.log('piezasIdsDelFront', piezasIdsDelFront);
  console.log('actualesIds', actualesIds);
  console.log('nuevasIds', nuevasIds);
  
  // 4️⃣ Detectar cuáles ya no están en el nuevo despiece
  const piezasAEliminar = actualesIds.filter(id => !piezasIdsDelFront.includes(id));

  console.log('piezasAEliminar', piezasAEliminar);

  if (piezasAEliminar.length > 0) {
    await db.despieces_detalle.destroy({
      where: {
        despiece_id,
        pieza_id: piezasAEliminar,
      },
      transaction,
    });
    console.log(`🗑️ Eliminadas ${piezasAEliminar.length} piezas que ya no están en el despiece`);
  }

  // 5️⃣ Insertar o actualizar las piezas adicionales nuevas
  const detalles = mapearDetallesDespiece({
    despiece: piezasNuevasAdicionales,
    despiece_id,
  });

  if (detalles.length > 0) {
    await db.despieces_detalle.bulkCreate(
      detalles.map(d => ({ ...d, despiece_id })),
      {
        updateOnDuplicate: [
          "cantidad",
          "peso_kg",
          "precio_venta_dolares",
          "precio_venta_soles",
          "precio_alquiler_soles",
        ],
        transaction,
      }
    );
    console.log(`✅ Insertadas/actualizadas ${detalles.length} piezas adicionales`);
  }
}

module.exports = { actualizarDespiecesDetalle };
