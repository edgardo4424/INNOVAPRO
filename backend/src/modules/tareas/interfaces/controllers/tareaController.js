const sequelizeTareaRepository = require('../../infrastructure/repositories/sequelizeTareaRepository');
const entidadService = require('../../infrastructure/services/entidadService'); 

const crearTarea = require('../../application/useCases/crearTarea'); 
const obtenerTareas = require('../../application/useCases/obtenerTareas'); 
const obtenerTareaPorId = require('../../application/useCases/obtenerTareaPorId'); 

const eliminarTarea = require('../../application/useCases/eliminarTarea'); 

const tomarTarea = require('../../application/useCases/tomarTarea')
const liberarTarea = require('../../application/useCases/liberarTarea')
const finalizarTarea = require('../../application/useCases/finalizarTarea')
const cancelarTarea = require('../../application/useCases/cancelarTarea')
const devolverTarea = require('../../application/useCases/devolverTarea')
const corregirTarea = require('../../application/useCases/corregirTarea')

const tareaRepository = new sequelizeTareaRepository(); 

const TareaController = {
    async crearTarea(req, res) {
        try {

            const data = {
                ...req.body,
                usuarioId: req.usuario.id
            }

            const nuevoTarea = await crearTarea(data, tareaRepository, entidadService );
           
            res.status(nuevoTarea.codigo).json(nuevoTarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async obtenerTareas(req, res) {
        try {
            const tareas = await obtenerTareas(tareaRepository);
            res.status(200).json(tareas.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async obtenerTareaPorId(req, res) {
        try {
            const tarea = await obtenerTareaPorId(req.params.id, tareaRepository); 
            res.status(tarea.codigo).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async eliminarTarea(req, res) {
        try {
            const tareaEliminado = await eliminarTarea(req.params.id, tareaRepository); 
            res.status(tareaEliminado.codigo).json(tareaEliminado.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async tomarTarea(req, res) {
        try {
            const tarea = await tomarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async liberarTarea(req, res) {
        try {
            const tarea = await liberarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async finalizarTarea(req, res) {
        try {
            const tarea = await finalizarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async cancelarTarea(req, res) {
        try {
            const tarea = await cancelarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async devolverTarea(req, res) {
        try {

            let motivo = req.body.motivo;
            if (typeof motivo !== "string") {
                motivo = req.body.motivo?.value || JSON.stringify(req.body.motivo);
            }

            const tarea = await devolverTarea(req.params.id, req.usuario.id, motivo, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async corregirTarea(req, res) {
        try {
            const correccion = req.body.correccion;
            const tarea = await corregirTarea(req.params.id, req.usuario.id, correccion, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },
};

module.exports = TareaController; 