const sequelizeCotizacionRepository = require('../../infrastructure/repositories/sequelizeCotizacionRepository'); // Importamos el repositorio de cotizaciones

const crearCotizacion = require('../../application/useCases/crearCotizacion'); 
const obtenerCotizaciones = require('../../application/useCases/obtenerCotizaciones'); 
const generarPdfCotizacion = require('../../application/useCases/generarPdfCotizacion');

/* const obtenerCotizacionPorId = require('../../application/useCases/obtenerCotizacionPorId'); // Importamos el caso de uso para obtener un cotizacion por ID
const actualizarCotizacion = require('../../application/useCases/actualizarCotizacion'); // Importamos el caso de uso para actualizar un cotizacion
const eliminarCotizacion = require('../../application/useCases/eliminarCotizacion'); // Importamos el caso de uso para eliminar un cotizacion
 */

const cotizacionRepository = new sequelizeCotizacionRepository(); // Instancia del repositorio de cotizaciones

const CotizacionController = {
    async crearCotizacion(req, res) {
        try {

            console.log('REQ.BODYYYYYYYYYYYYYYYYYYYYYYYY', req.body);
            const datos = {
                ...req.body,
                cotizacion: {
                    ...req.body.cotizacion,
                    usuario_id: req.usuario.id,
                    usuario_rol: req.usuario.rol
                }
                
            }
            console.log("datos que llegan al crear coti", datos)
            const nuevaCotizacion = await crearCotizacion(datos, cotizacionRepository ); // Llamamos al caso de uso para crear un cotizacion
           
            res.status(nuevaCotizacion.codigo).json(nuevaCotizacion.respuesta); // Respondemos con la cotizacion creada
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

   async obtenerCotizaciones(req, res) {
        try {
           
            const cotizaciones = await obtenerCotizaciones(cotizacionRepository); // Llamamos al caso de uso para obtener todos las cotizaciones
           
            res.status(200).json(cotizaciones.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async generarPdfCotizacion(req, res) {
        try {
            const idCotizacion = req.body.id;

            const datosCotizacion = await generarPdfCotizacion(idCotizacion, cotizacionRepository ); 
            res.status(datosCotizacion.codigo).json(datosCotizacion.respuesta); 
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }
    

    /*async obtenerCotizacionPorId(req, res) {
        try {
            const cotizacion = await obtenerCotizacionPorId(req.params.id, cotizacionRepository); // Llamamos al caso de uso para obtener una cotizacion por ID
            res.status(cotizacion.codigo).json(cotizacion.respuesta); 
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarCotizacion(req, res) {
        try {
            const cotizacionActualizada = await actualizarCotizacion(req.params.id, req.body, cotizacionRepository); // Llamamos al caso de uso para actualizar un cotizacion
            
            res.status(cotizacionActualizada.codigo).json(cotizacionActualizada.respuesta); // Respondemos con la cotizacion actualizada
        } catch (error) {
            
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarCotizacion(req, res) {
        try {
            const cotizacionEliminada = await eliminarCotizacion(req.params.id, cotizacionRepository); // Llamamos al caso de uso para eliminar una cotizacion
            res.status(cotizacionEliminada.codigo).json(cotizacionEliminada.respuesta); // Respondemos con la cotizacion eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    } */

};

module.exports = CotizacionController; // Exportamos el controlador de cotizacions