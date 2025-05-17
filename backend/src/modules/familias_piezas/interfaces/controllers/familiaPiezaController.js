const sequelizeFamiliaPiezaRepository = require('../../infrastructure/repositories/sequelizeFamiliaPiezaRepository'); // Importamos el repositorio de familias

const obtenerFamiliasPiezas = require('../../application/useCases/obtenerFamiliasPiezas'); // Importamos el caso de uso para obtener todas las familias

const familiaPiezaRepository = new sequelizeFamiliaPiezaRepository(); // Instancia del repositorio de familiaPieza

const FamiliaPiezaController = {

    async obtenerFamiliasPiezas(req, res) {
        try {
            const familia = await obtenerFamiliasPiezas(familiaPiezaRepository); // Llamamos al caso de uso para obtener las piezas
           
            res.status(200).json(familia.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = FamiliaPiezaController; // Exportamos el controlador de FamiliaPieza