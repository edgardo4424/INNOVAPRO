const db = require("../../../../models");
const { mapearDetallesDespiece } = require("./mapearDetallesDespieceService");

async function actualizarDespiecesDetalle({ despiece_id, despiece, transaction }) {
    console.log('despiece', despiece);
  // 1️⃣ Filtrar las piezas adicionales que vienen del front
  const despieceFiltrado = despiece.filter(d => d.esAdicional === true);

  if (despieceFiltrado.length === 0) {
    console.log("⚠️ No hay piezas adicionales para actualizar");
    return;
  }

  // 2️⃣ Obtener el listado de pieza_id que son adicionales
  const piezaIdsAdicionales = despieceFiltrado.map(d => d.pieza_id);

  // 3️⃣ Traer las piezas actuales en BD que sean esas adicionales
  const piezasActuales = await db.despieces_detalle.findAll({
    where: {
      despiece_id,
      pieza_id: piezaIdsAdicionales
    },
    raw: true,
  });

  // 4️⃣ Comparar claves
  const clavesActuales = piezasActuales.map(p => p.pieza_id);
  const clavesNuevas = piezaIdsAdicionales;

  // 5️⃣ Detectar qué claves eliminar
  const clavesAEliminar = clavesActuales.filter(c => !clavesNuevas.includes(c));

  // 6️⃣ Borrar registros que no estén en la nueva lista
  if (clavesAEliminar.length > 0) {
    await db.despieces_detalle.destroy({
      where: {
        despiece_id,
        pieza_id: clavesAEliminar
      },
      transaction
    });
    console.log(`🗑️ Eliminadas ${clavesAEliminar.length} piezas adicionales`);
  }

  // 7️⃣ Insertar o actualizar las nuevas adicionales
  const detalles = mapearDetallesDespiece({ despiece: despieceFiltrado, despiece_id });

  console.log('NUEVAS ADICIONALES', detalles);

  if (detalles.length > 0) {
    await db.despieces_detalle.bulkCreate(detalles.map(d => ({
      ...d,
      despiece_id
    })), {
      updateOnDuplicate: [
        'cantidad',
        'peso_kg',
        'precio_venta_dolares',
        'precio_venta_soles',
        'precio_alquiler_soles'
      ],
      transaction
    });
    console.log(`✅ Insertadas/actualizadas ${detalles.length} piezas adicionales`);
  }
}

module.exports = { actualizarDespiecesDetalle };
