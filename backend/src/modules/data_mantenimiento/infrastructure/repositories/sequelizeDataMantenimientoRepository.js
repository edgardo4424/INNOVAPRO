const { DataMantenimiento } = require("../models/dataMantenimientoModel");

class SequelizeDataRepository {
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
    
    async obtenerDataMantenimientoPorCodigoImporte(cod) {
                    console.log('Entro');

        const d_m = await DataMantenimiento.findAll();
        const d_m_limpio=d_m.map((d)=>d.get({plain:true}));
        const filtro=d_m_limpio.filter((d)=>{
            return d.codigo?.includes(cod);
        })
        return(filtro)
    }
}

module.exports = SequelizeDataRepository; 