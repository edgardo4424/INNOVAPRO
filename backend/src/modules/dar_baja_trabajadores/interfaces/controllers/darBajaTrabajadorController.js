const darBajaTrabajador = require("../../../../application/services/darBajaTrabajador");
const darBajaTrabajadorv2 = require("../../../../application/services/darBajaTrabajadorv2");
const visualizarBajaTrabajador = require("../../../../application/services/visualizarBajaTrabajador");
const ObtenerTrabajadoresDadosDeBaja = require("../../application/useCases/ObtenerTrabajadoresDadosDeBaja");

const sequelizeDarBajaTrabajadorRepository = require('../../infrastructure/repositories/sequelizeDarBajaTrabajadorRepository'); 
const darBajaTrabajadorRepository = new sequelizeDarBajaTrabajadorRepository();

const DarBajaTrabajadorController = {
   

    async darBajaTrabajador(req, res) {

        try {
            const usuario_cierre_id = req.usuario.id;

            const dataBody = {
                usuario_cierre_id,
                ...req.body,
            }

            const response = await darBajaTrabajador(dataBody); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async obtenerTrabajadoresDadosDeBaja(req, res) {

        try {

            const response = await ObtenerTrabajadoresDadosDeBaja(darBajaTrabajadorRepository); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async visualizarBajaTrabajador(req, res) {

        try {

            const { id } = req.params;

            console.log('id',id);

            const response = await visualizarBajaTrabajador(id); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async darBajaTrabajadorv2(req, res) {

        try {
            const usuario_cierre_id = req.usuario.id;

            const dataBody = {
                usuario_cierre_id,
                ...req.body,
            }

            const response = await darBajaTrabajadorv2(dataBody); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

};

module.exports = DarBajaTrabajadorController; 