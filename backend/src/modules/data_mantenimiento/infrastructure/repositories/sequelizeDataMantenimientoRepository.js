const { DataMantenimiento } = require("../models/dataMantenimientoModel");

class SequelizeDataRepositoryRepository {
    getModel() {
        return require('../models/dataMantenimientoModel').DataMantenimiento; 
    }

    async obtenerDataMantenimiento() {
        return await DataMantenimiento.findAll();
    }

    async obtenerPorId(id) {
        return await DataMantenimiento.findByPk(id); 
    }
    async obtenerPorCodigo(codigo) {
        return await DataMantenimiento.findOne({where:{codigo:codigo}}); 
    }

    async actualizarDataMantenimiento(id, dataMantenimiento) {
        const mantenimiento = await DataMantenimiento.findByPk(id); 
        if (!mantenimiento) { 
          console.log("❌ Data de mantenimiento no encontrado");
          return null; 
        }
        await mantenimiento.update(dataMantenimiento); 
        return mantenimiento; 
      }

}

module.exports = SequelizeDataRepositoryRepository; 