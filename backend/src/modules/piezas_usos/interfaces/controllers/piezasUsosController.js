const sequelizePiezasUsosRepository = require('../../infrastructure/repositories/sequelizePiezasUsosRepository'); // Importamos el repositorio de PiezasUsos

const obtenerPiezasUsos = require('../../application/useCases/obtenerPiezasUsos'); // Importamos el caso de uso para obtener todas las usos

const piezasUsosRepository = new sequelizePiezasUsosRepository(); // Instancia del repositorio de stock

const PiezasUsosController = {

    async obtenerPiezasUsos(req, res) {
        try {
            const piezasUsos = await obtenerPiezasUsos(piezasUsosRepository); // Llamamos al caso de uso para obtener las usos
            res.status(200).json(piezasUsos.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

   
};

module.exports = PiezasUsosController; // Exportamos el controlador de stock