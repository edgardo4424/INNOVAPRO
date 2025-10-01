const sequelizeAtributoRepository = require('../../infrastructure/repositories/sequelizeAtributoRepository'); // Importamos el repositorio de atributos

const obtenerAtributos = require('../../application/useCases/obtenerAtributos');
const obtenerAtributosPorUsoId = require('../../application/useCases/obtenerAtributosPorUsoId');

const atributoRepository = new sequelizeAtributoRepository(); // Instancia del repositorio de stock

const AtributoController = {


    async obtenerAtributos(req, res) {
        try {
            const atributos = await obtenerAtributos(atributoRepository); // Llamamos al caso de uso para obtener los atributos
            res.status(200).json(atributos.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerAtributosPorUsoId(req, res) {
        try {
            const atributos = await obtenerAtributosPorUsoId(req.params.id, atributoRepository); // Llamamos al caso de uso para obtener los atributos por UsoId
            res.status(200).json(atributos.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = AtributoController; // Exportamos el controlador de atributo