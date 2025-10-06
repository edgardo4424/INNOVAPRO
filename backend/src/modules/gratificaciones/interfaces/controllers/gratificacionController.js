const sequelizeGratificacionRepository = require('../../infrastructure/repositories/sequelizeGratificacionRepository'); // Importamos el repositorio de Gratificaciones

const obtenerGratificacionesCerradas = require('../../application/useCases/obtenerGratificacionesCerradas'); // Importamos el caso de uso para obtener todos los Gratificaciones
const calcularGratificaciones = require('../../application/useCases/calcularGratificaciones');
const cierreGratificaciones = require('../../application/useCases/cierreGratificaciones'); 

const obtenerGratificacionPorTrabajador = require('../../application/useCases/obtenerGratificacionPorTrabajador');

const gratificacionRepository = new sequelizeGratificacionRepository(); // Instancia del repositorio de gratifaciones

const db = require("../../../../database/models");
const cierreGratificacionTruncaPorTrabajador = require('../../application/useCases/cierreGratificacionTruncaPorTrabajador');
const obtenerTotalGratificacionPorTrabajador = require('../../application/useCases/obtenerTotalGratificacionPorTrabajador');
const calcularGratificacionPorTrabajador = require('../../application/useCases/calcularGratificacionPorTrabajador');

const GratificacionController = {
   

    async obtenerGratificacionesCerradas(req, res) {
        try {
            const gratificacionesCerradas = await obtenerGratificacionesCerradas(req.body, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificacionesCerradas
           
            res.status(gratificacionesCerradas.codigo).json(gratificacionesCerradas.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    
    async calcularGratificaciones(req, res) {
        try {
            const { periodo, anio, filial_id } = req.body;

            console.log({
                periodo,
                anio,
                filial_id
            });

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

    async cierreGratificacionTruncaPorTrabajador(req, res) {
        const transaction = await db.sequelize.transaction(); // Iniciar transacción
        try {
            
            const { periodo, anio, filial_id, trabajador_id, fecha_ingreso, fecha_fin } = req.body;
            const usuario_cierre_id = req.usuario.id
             const gratificacionPorTrabajador = await cierreGratificacionTruncaPorTrabajador(usuario_cierre_id, periodo, anio, filial_id, trabajador_id, fecha_ingreso, fecha_fin, gratificacionRepository, transaction); // Llamamos al caso de uso para obtener todos los gratificaciones
           await transaction.commit(); // ✔ Confirmar transacción
            res.status(gratificacionPorTrabajador.codigo).json(gratificacionPorTrabajador.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
             await transaction.rollback(); // ❌ Deshacer todo si algo falla
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

     async obtenerGratificacionPorTrabajador(req, res) {
        try {
            const { periodo, anio, filial_id, trabajador_id } = req.body;
            
             const gratificacionPorTrabajador = await obtenerGratificacionPorTrabajador(periodo, anio, filial_id, trabajador_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificaciones
           
            res.status(gratificacionPorTrabajador.codigo).json(gratificacionPorTrabajador.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerTotalGratificacionPorTrabajador(req, res) {
        try {
            console.log('entre');
            const { periodo, anio, filial_id, trabajador_id } = req.body;
            
             const gratificacionPorTrabajadorTotal = await obtenerTotalGratificacionPorTrabajador(periodo, anio, filial_id, trabajador_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificaciones
           
            res.status(gratificacionPorTrabajadorTotal.codigo).json(gratificacionPorTrabajadorTotal.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async calcularGratificacionPorTrabajador(req, res) {
        try {
            const { periodo, anio, filial_id, trabajador_id } = req.body;

            const gratificacion = await calcularGratificacionPorTrabajador(periodo, anio, filial_id, trabajador_id, gratificacionRepository); // Llamamos al caso de uso para obtener todos los gratificacion
           
            res.status(gratificacion.codigo).json(gratificacion.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },
};

module.exports = GratificacionController; // Exportamos el controlador de Gratificaciones