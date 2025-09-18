const DeclaracionMultiempleoRepository = require('../../domain/repositories/DeclaracionMultiempleoRepository');
const Model = require('../models/DeclaracionMultiempleoModel');
const { num, intOrNull } = require('../../shared/utils/helpers');

class SequelizeDeclaracionMultiempleoRepository extends DeclaracionMultiempleoRepository {
    async insertarPorDniAnio(dto = {}) {
        const where = { dni: String(dto.dni), anio: Number(dto.anio) };
        let row = await Model.findOne({ where, raw: false });

        const payload = {
            ...where,
            aplica_desde_mes: intOrNull(dto.aplica_desde_mes),
            filial_principal_id: dto.filial_principal_id == null ? null : Number(dto.filial_principal_id),
            es_secundaria: !!dto.es_secundaria,

            principal_ruc: dto.principal_ruc || null,
            principal_razon_social: dto.principal_razon_social || null,

            renta_bruta_otros_anual: num(dto.renta_bruta_otros_anual),
            retenciones_previas_otros: num(dto.retenciones_previas_otros),

            detalle_json: dto.detalle_json || null,
            observaciones: dto.observaciones || null,
            archivo_url: dto.archivo_url || null,

            estado: dto.estado || 'VIGENTE',
            es_oficial: dto.es_oficial !== false,
        };

        if (row) { await row.update(payload); }
        else     { row = await Model.create(payload); }

        return row;
    }

    async registrarOficial(dto) {
        dto.es_oficial = true;
        return this.insertarPorDniAnio(dto);
    }

    async obtenerPorDniAnio({ dni, anio }) {
        if (!dni || !anio) return null;
        return await Model.findOne({
            where: { dni, anio: Number(anio), es_oficial: true },
            order: [['updated_at', 'DESC'], ['id', 'DESC']],
        });
    }
}

module.exports = SequelizeDeclaracionMultiempleoRepository;