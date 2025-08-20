const sequelizeGratificacionRepository = require('../../infrastructure/repositories/sequelizeGratificacionRepository'); // Importamos el repositorio de Gratificaciones

const obtenerGratificacionesCerradas = require('../../application/useCases/obtenerGratificacionesCerradas'); // Importamos el caso de uso para obtener todos los Gratificaciones
const calcularGratificaciones = require('../../application/useCases/calcularGratificaciones');
const cierreGratificaciones = require('../../application/useCases/cierreGratificaciones'); 
const cierreGratificacionPorTrabajador = require('../../application/useCases/cierreGratificacionPorTrabajador');

const gratificacionRepository = new sequelizeGratificacionRepository(); // Instancia del repositorio de gratifaciones

const GratificacionController = {
   

    async obtenerGratificacionesCerradas(req, res) {
        try {
            const gratificacionesCerradas = await obtenerGratificacionesCerradas(req.body, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificacionesCerradas
           
            res.status(200).json(gratificacionesCerradas.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    
    async calcularGratificaciones(req, res) {
        try {
            const { periodo, anio, filial_id } = req.body;

            const gratificaciones = await calcularGratificaciones(periodo, anio, filial_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificaciones
           
            res.status(gratificaciones.codigo).json(gratificaciones.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

     async cierreGratificaciones(req, res) {
        try {
            const { periodo, anio, filial_id } = req.body;
            const usuario_cierre_id = req.usuario.id

            const gratificaciones = await cierreGratificaciones(usuario_cierre_id, periodo, anio, filial_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificaciones
           
            res.status(gratificaciones.codigo).json(gratificaciones.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async cierreGratificacionPorTrabajador(req, res) {
        try {
            const { periodo, anio, filial_id, trabajador_id } = req.body;
            const usuario_cierre_id = req.usuario.id
             const gratificacionPorTrabajador = await cierreGratificacionPorTrabajador(usuario_cierre_id, periodo, anio, filial_id, trabajador_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificaciones
           
            res.status(gratificacionPorTrabajador.codigo).json(gratificacionPorTrabajador.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }

};

module.exports = GratificacionController; // Exportamos el controlador de Gratificaciones