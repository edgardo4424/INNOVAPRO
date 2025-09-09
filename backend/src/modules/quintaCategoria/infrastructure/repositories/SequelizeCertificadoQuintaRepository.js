const CertificadoQuintaRepository = require('../../domain/repositories/CertificadoQuintaRepository');
const Model = require('../models/CertificadoQuintaModel');
const { Op } = require('sequelize');

class SequelizeCertificadoQuintaRepository extends CertificadoQuintaRepository {
    async obtenerPorDniAnio({ dni, anio }) {
        if (!dni || !anio) return null;
        return await Model.findOne({ 
            where: { dni, anio: Number(anio), es_oficial: true },
            order: [['updated_at', 'DESC'], ['id', 'DESC']],
        });
    }

    async registrarOficial(dto) {
        if (!dto?.dni || !dto?.anio) throw new Error('Faltan campos obligatorios (dni, anio)');
        await Model.update({ es_oficial: false }, { where: { dni: dto.dni, anio: Number(dto.anio) } });
        dto.es_oficial = true;
        return await Model.create(dto);
    }
}

module.exports = SequelizeCertificadoQuintaRepository;