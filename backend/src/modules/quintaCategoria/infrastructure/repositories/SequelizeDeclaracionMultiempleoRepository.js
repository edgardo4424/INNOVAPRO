const DeclaracionMultiempleoRepository = require('../../domain/repositories/DeclaracionMultiempleoRepository');
const Model = require('../models/DeclaracionMultiempleoModel');
const DetalleModel = require('../models/DeclaracionMultiempleoDetalleModel');

class SequelizeDeclaracionMultiempleoRepository extends DeclaracionMultiempleoRepository {
    async registrarOficial(dto) {
        if (!dto?.dni || !dto?.anio || !dto?.aplica_desde_mes) {
        throw new Error('Faltan campos obligatorios (dni, anio, aplica_desde_mes)');
        }
        await Model.update(
            { es_oficial: false },
            { where: { dni: dto.dni, anio: Number(dto.anio) } }
        );
        dto.es_oficial = true;
        return await Model.create(dto);
    }

    async obtenerPorDniAnio({ dni, anio }) {
        if (!dni || !anio) return null;
        return await Model.findOne({
            where: { dni, anio: Number(anio), es_oficial: true },
            order: [['updated_at', 'DESC'], ['id', 'DESC']],
        });
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