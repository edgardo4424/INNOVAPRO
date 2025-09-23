// src/utils/ubigeoHelper.js
const quitarTildes = (s = '') =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const norm = s => quitarTildes(String(s).toUpperCase().trim());

/**
 * Obtiene el código ubigeo a partir de los componentes de Google y la tabla Ubigeos
 * @param {Array} geocode - results[0].address_components
 * @param {Sequelize.Model} UbigeoModel - modelo Sequelize de la tabla ubigeos
 * @returns {Promise<string|null>}
 */
async function ubigeoDesdeDireccion(geocode, UbigeoModel) {
    const get = t =>
        geocode.find(c => c.types.includes(t))?.long_name;

    let distrito = get('locality');
    let provincia = get('administrative_area_level_2');
    let departamento = get('administrative_area_level_1');

    if (!distrito || !provincia || !departamento) return null;

    // Normalización Perú
    departamento = departamento.replace(/^PROVINCIA DE\s+/i, ''); // "Provincia de Lima" -> "Lima"

    const where = {
        departamento: norm(departamento),
        provincia: norm(provincia),
        distrito: norm(distrito),
    };

    const row = await UbigeoModel.findOne({ where });
    return row ? row.codigo : null;
}

module.exports = { ubigeoDesdeDireccion };
