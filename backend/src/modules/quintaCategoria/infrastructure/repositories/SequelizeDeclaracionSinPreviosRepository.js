const DeclaracionSinPreviosRepository = require('../../domain/repositories/DeclaracionSinPreviosRepository');
const Model = require('../models/DeclaracionSinPreviosModel');

class SequelizeDeclaracionesSinPreviosRepository extends DeclaracionSinPreviosRepository {
    async insertarPorDniAnio(entidad) {
        const { dni, anio } = entidad;
        const [fila, creado] = await Model.unscoped().findOrCreate({ where: { dni, anio}, defaults: entidad });
        if (!creado) await fila.update(entidad);
        return fila;
    }
    
    async obtenerPorDniAnio({ dni, anio }) {
        if (!dni || !Number(anio)) return null;
        return await Model.unscoped().findOne({
            where: { dni, anio, estado: 'vigente' },
            attributes: ['id', 'dni', 'anio', 'aplica_desde_mes', 'archivo_url', 'observaciones', 'estado'],
            raw: true,
        });
    }
    
    async obtenerAplicablePorDniAnioMes({ dni, anio, mes }) {
        if (!dni || !Number(anio) || !Number(mes)) return null;
        const fila = await Model.unscoped().findOne({
            where: { dni, anio, estado: 'vigente' },
            attributes: ['id', 'dni', 'anio', 'aplica_desde_mes', 'archivo_url', 'observaciones', 'estado'],
            raw: true,
        });
        if (!fila) return null;
        const m = Number(mes);
        const aplicaDesde = Number(fila.aplica_desde_mes || 1);
        return m < aplicaDesde ? fila : null;
    }
}

module.exports = SequelizeDeclaracionesSinPreviosRepository;