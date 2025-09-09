const CertificadoQuintaRepository = require('../../domain/repositories/CertificadoQuintaRepository');
const Model = require('../models/CertificadoQuintaModel');

class SequelizeCertificadoQuintaRepository extends CertificadoQuintaRepository {
    async insertarPorDniAnio(entidad) {
        const { dni, anio } = entidad;
        const [ fila, creado ] = await Model.findOrCreate({ where: { dni, anio }, defaults: entidad });
        if (!creado) await fila.update(entidad);
        return fila;
    }
    
    async obtenerPorDniAnio({ dni, anio }) {
        return await Model.findOne({ where: { dni, anio, estado: "VIGENTE"} });
    }
}

module.exports = SequelizeCertificadoQuintaRepository;