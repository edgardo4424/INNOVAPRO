const darBajaTrabajador = require("../../../../application/services/darBajaTrabajador");

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

};

module.exports = DarBajaTrabajadorController; 