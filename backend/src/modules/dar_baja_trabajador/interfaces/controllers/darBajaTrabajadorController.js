const darBajaTrabajador = require("../../../../application/services/darBajaTrabajador");

const DarBajaTrabajadorController = {
   

    async darBajaTrabajador(req, res) {

        try {
            console.log('entre');
            const { trabajador_id } = req.body; // id del trabajador

            const response = await darBajaTrabajador(trabajador_id); 
           
            res.status(response.codigo).json(response.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

};

module.exports = DarBajaTrabajadorController; 