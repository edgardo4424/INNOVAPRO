const sequelizeDataMantenimientoRepository = require('../../infrastructure/repositories/sequelizeDataMantenimientoRepository'); 

const obtenerDataMantenimiento = require('../../application/useCases/obtenerDataMantenimiento'); 
const obtenerDataMantenimientoPorId = require('../../application/useCases/obtenerDataMantenimientoPorId'); 
const actualizarDataMantenimiento = require('../../application/useCases/actualizarDataMantenimiento'); 

const dataMantenimientoRepository = new sequelizeDataMantenimientoRepository(); 

const DataMantenimientoController = {

    async obtenerDataMantenimiento(req, res) {
        try {
            const dataMantenimiento = await obtenerDataMantenimiento(dataMantenimientoRepository); 
           
            res.status(200).json(dataMantenimiento.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerDataMantenimientoPorId(req, res) {
        try {
            const dataMantenimiento = await obtenerDataMantenimientoPorId(req.params.id, dataMantenimientoRepository); 
            res.status(dataMantenimiento.codigo).json(dataMantenimiento.respuesta); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async actualizarDataMantenimiento(req, res) {
        try {

            const actualizado_por = req.usuario?.id || null;

            const dataBody = {...req.body, actualizado_por};

            const dataMantenimiento = await actualizarDataMantenimiento(req.params.id, dataBody, dataMantenimientoRepository);
            
            res.status(dataMantenimiento.codigo).json(dataMantenimiento.respuesta); 
        } catch (error) {
            
            res.status(500).json({ error: error.message });
        }
    },


};

module.exports = DataMantenimientoController; 