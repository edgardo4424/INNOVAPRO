const sequelizeGratificacionRepository = require('../../infrastructure/repositories/sequelizeGratificacionRepository'); // Importamos el repositorio de Gratificaciones

const obtenerGratificaciones = require('../../application/useCases/obtenerGratificaciones'); // Importamos el caso de uso para obtener todos los Gratificaciones
const calcularGratificaciones = require('../../application/useCases/calcularGratificaciones');


const gratificacionRepository = new sequelizeGratificacionRepository(); // Instancia del repositorio de gratifaciones

const GratificacionController = {
   

    async obtenerGratificaciones(req, res) {
        try {
            const gratifiaciones = await obtenerGratificaciones(gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratifiaciones
           
            res.status(200).json(gratifiaciones.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    
    async calcularGratificaciones(req, res) {
        try {
            const { periodo, anio } = req.body;

            const gratifiaciones = await calcularGratificaciones(periodo, anio, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratifiaciones
           
            res.status(200).json(gratifiaciones.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = GratificacionController; // Exportamos el controlador de Gratificaciones