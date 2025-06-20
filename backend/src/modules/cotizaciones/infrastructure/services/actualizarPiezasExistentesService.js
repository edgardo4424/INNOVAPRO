
const db = require('../../../../models');

async function actualizarPiezasExistentes({ detalles, despiece_id, transaction }) {
  // 1. Buscar qué piezas+uuid ya existen en BD
  const existentes = await db.despieces_detalle.findAll({
    where: { despiece_id },
    attributes: ['pieza_id', 'uuid'],
    raw: true
  });

  // Mapeamos las keys pieza_id + uuid (uuid puede ser null, lo convertimos a string)
  const existentesKeys = existentes.map(x => `${x.pieza_id}_${x.uuid || 'null'}`);

  // 2. Solo procesamos piezas NUEVAS (que vienen con uuid desde el front)
  const nuevos = detalles.filter(d => {
    // Si NO tiene uuid → es pieza de OT → no la insertamos
    if (!d.uuid) return false;

    // Si viene con uuid → armamos key
    const key = `${d.pieza_id}_${d.uuid}`;

    // Si ya existe en BD → no insertar de nuevo
    return !existentesKeys.includes(key);
  });

  // 3. Insertar nuevas piezas
  if (nuevos.length > 0) {
    await db.despieces_detalle.bulkCreate(nuevos, { transaction });
  }

  // Log para control
  return {
    insertados: nuevos.length,
    ya_existentes: existentesKeys.length
  };
};

module.exports = { actualizarPiezasExistentes };

