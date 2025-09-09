const DeclaracionMultiempleoRepository = require('../../domain/repositories/DeclaracionMultiempleoRepository');
const Model = require('../models/DeclaracionMultiempleoModel');
const DetalleModel = require('../models/DeclaracionMultiempleoDetalleModel');

class SequelizeDeclaracionMultiempleoRepository extends DeclaracionMultiempleoRepository {
    async insertarPorDniAnio(entidad) {
        const { dni, anio } = entidad;
        const [fila, creado] = await Model.findOrCreate({ where: { dni, anio }, defaults: entidad });
        if (!creado) {
            await fila.update(entidad);
        }
        return fila;
    }

    async obtenerPorDniAnio({ dni, anio }) {
        return await Model.findOne({ where: { dni, anio, estado: "VIGENTE" } });
    }

    async insertarDetalles(multiempleoId, detalles=[]) {
        // eliminamos los previos
        await DetalleModel.destroy({ where: { multiempleo_id: multiempleoId } });
        if (!detalles.length) return [];
        const filas = detalles.map(detalle => ({ ...detalle, multiempleo_id: multiempleoId }));
        return await DetalleModel.bulkCreate(filas);
    }

    async obtenerDetalles({ multiempleoId }) {
        return await DetalleModel.findAll({ where: { multiempleo_id: multiempleoId, estado:"VIGENTE" } });
    }
}

module.exports = SequelizeDeclaracionMultiempleoRepository;