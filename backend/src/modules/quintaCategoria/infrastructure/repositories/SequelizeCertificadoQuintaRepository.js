const CertificadoQuintaRepository = require('../../domain/repositories/CertificadoQuintaRepository');
const Model = require('../models/CertificadoQuintaModel');
const { num, intOrNull } = require('../../shared/utils/helpers');

class SequelizeCertificadoQuintaRepository extends CertificadoQuintaRepository {
    async obtenerPorDniAnio({ dni, anio }) {
        const row = await Model.findOne({ 
            where: { dni, anio: Number(anio), es_oficial: true },
            order: [['updated_at', 'DESC'], ['id', 'DESC']],
            raw: true,
        });
        if (!row) return { found: false }
        return {
            found: true,
            id: row.id,
            dni: row.dni,
            anio: Number(row.anio),
            aplica_desde_mes: intOrNull(row.aplica_desde_mes),
            empresa_ruc: row.empresa_ruc || '',
            empresa_razon_social: row.empresa_razon_social || '',
            fecha_emision: row.fecha_emision || null,
            renta_bruta_total: num(row.renta_bruta_total),
            remuneraciones: num(row.remuneraciones),
            gratificaciones: num(row.gratificaciones),
            otros: num(row.otros),
            asignacion_familiar: num(row.asignacion_familiar),
            retenciones_previas: num(row.retenciones_previas),
            detalle_json: row.detalle_json || null,
            archivo_url: row.archivo_url || null,
            estado: row.estado,
            updated_at: row.updated_at || row.updatedAt || null,
            es_oficial: !!row.es_oficial,
        };
    }

    async insertarPorDniAnio(dto) {
        const where = { dni: dto.dni, anio: Number(dto.anio) };
        const existing = await Model.findOne({ where, raw: false });

        const payload = {
            ...where,
            aplica_desde_mes: intOrNull(dto.aplica_desde_mes),
            empresa_ruc: dto.empresa_ruc || '',
            empresa_razon_social: dto.empresa_razon_social || '',
            fecha_emision: dto.fecha_emision || null,

            renta_bruta_total: num(dto.renta_bruta_total),
            remuneraciones: num(dto.remuneraciones),
            gratificaciones: num(dto.gratificaciones),
            otros: num(dto.otros),
            asignacion_familiar: num(dto.asignacion_familiar),

            retenciones_previas: num(dto.retenciones_previas),
            detalle_json: dto.detalle_json || null,
            archivo_url: dto.archivo_url || null,

            estado: 'vigente',
            es_oficial: true,
        };

        let row;
        if (existing) {
            await existing.update(payload);
            row = existing;
        } else {
            row = await Model.create(payload);
        }

        const certificado = row.toJSON();
        return {
            found: true,
            id: certificado.id,
            dni: certificado.dni,
            anio: Number(certificado.anio),
            aplica_desde_mes: intOrNull(certificado.aplica_desde_mes),
            empresa_ruc: certificado.empresa_ruc || '',
            empresa_razon_social: certificado.empresa_razon_social || '',
            fecha_emision: certificado.fecha_emision || null,
            renta_bruta_total: num(certificado.renta_bruta_total),
            remuneraciones: num(certificado.remuneraciones),
            gratificaciones: num(certificado.gratificaciones),
            otros: num(certificado.otros),
            asignacion_familiar: num(certificado.asignacion_familiar),
            retenciones_previas: num(certificado.retenciones_previas),
            detalle_json: certificado.detalle_json || null,
            archivo_url: certificado.archivo_url || null,
            estado: certificado.estado,
            updated_at: certificado.updated_at || certificado.updatedAt || null,
            es_oficial: !!certificado.es_oficial,
        };
    }

}

module.exports = SequelizeCertificadoQuintaRepository;