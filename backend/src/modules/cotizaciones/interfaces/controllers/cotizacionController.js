const sequelizeCotizacionRepository = require('../../infrastructure/repositories/sequelizeCotizacionRepository'); // Importamos el repositorio de cotizaciones

const crearCotizacion = require('../../application/useCases/crearCotizacion'); 
const obtenerCotizaciones = require('../../application/useCases/obtenerCotizaciones'); 
const generarPdfCotizacion = require('../../application/useCases/generarPdfCotizacion');
const crearCotizacionConOT = require('../../application/useCases/crearCotizacionConOT');

// Casos de uso para condiciones de alquiler
const solicitarCondicionesAlquiler = require('../../application/useCases/solicitarCondicionesAlquiler');
const crearCondicionAlquiler = require('../../application/useCases/crearCondicionAlquiler');

const sequelizeCondicionAlquilerRepository = require('../../condicionesAlquiler/infrastructure/repositories/sequelizeCondicionAlquilerRepository');
const condicionRepository = new sequelizeCondicionAlquilerRepository();

const mostrarCotizacionPorId = require('../../application/useCases/mostrarCotizacionPorId')


/* const obtenerCotizacionPorId = require('../../application/useCases/obtenerCotizacionPorId'); // Importamos el caso de uso para obtener un cotizacion por ID
const actualizarCotizacion = require('../../application/useCases/actualizarCotizacion'); // Importamos el caso de uso para actualizar un cotizacion
const eliminarCotizacion = require('../../application/useCases/eliminarCotizacion'); // Importamos el caso de uso para eliminar un cotizacion
 */

const cotizacionRepository = new sequelizeCotizacionRepository(); // Instancia del repositorio de cotizaciones

const CotizacionController = {
    async crearCotizacion(req, res) {
        try {

            const datos = {
                ...req.body,
                cotizacion: {
                    ...req.body.cotizacion,
                    usuario_id: req.usuario.id,
                    usuario_rol: req.usuario.rol
                }
                
            }

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
    },

    async crearCotizacionConOT(req, res) {
        try {
            const datos = {
                ...req.body,
                cotizacion: {
                    ...req.body.cotizacion,
                    usuario_id: req.usuario.id,
                    usuario_rol: req.usuario.rol
                }
                
            }
            const nuevaCotizacion = await crearCotizacionConOT(datos, cotizacionRepository ); // Llamamos al caso de uso para crear un cotizacion
           
            res.status(nuevaCotizacion.codigo).json(nuevaCotizacion.respuesta); // Respondemos con la cotizacion creada
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },
    

    async mostrarCotizacionPorId(req, res) {
        try {
            const cotizacion = await mostrarCotizacionPorId(req.params.id, cotizacionRepository); // Llamamos al caso de uso para obtener una cotizacion por ID
            res.status(cotizacion.codigo).json(cotizacion.respuesta); 
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    // Este método maneja la solicitud de condiciones de alquiler para una cotización específica
    // Recibe el ID de la cotización desde los parámetros de la solicitud y un comentario
    async solicitarCondiciones(req, res) {
        try {
            const cotizacion_id = parseInt(req.params.id);
            const comentario = req.body.comentario || "";
            const creado_por = req.usuario?.id || null;

            // Cambiamos el estado
            const cambio = await solicitarCondicionesAlquiler(cotizacion_id, cotizacionRepository);
            if (cambio.codigo !== 200) return res.status(cambio.codigo).json(cambio.respuesta);

            // Registramos el comentario solo si no existe aún
            const yaExiste = await condicionRepository.obtenerPorCotizacionId(cotizacion_id);
            if (!yaExiste) {
                await crearCondicionAlquiler({ cotizacion_id, comentario_solicitud: comentario, creado_por }, condicionRepository);
            }

            return res.status(200).json({ mensaje: "Solicitud registrada correctamente" });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ mensaje: "Error al registrar la solicitud" });
        }
    },


    /* async actualizarCotizacion(req, res) {
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