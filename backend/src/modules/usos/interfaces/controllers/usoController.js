const sequelizeUsoRepository = require('../../infrastructure/repositories/sequelizeUsoRepository'); // Importamos el repositorio de usos

const obtenerUsos = require('../../application/useCases/obtenerUsos'); // Importamos el caso de uso para obtener todas las usos

const usoRepository = new sequelizeUsoRepository(); // Instancia del repositorio de stock

const UsoController = {

    async obtenerUsos(req, res) {
        try {
            const usos = await obtenerUsos(usoRepository); // Llamamos al caso de uso para obtener las usos
            res.status(200).json(usos.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

   
};

module.exports = UsoController; // Exportamos el controlador de stock