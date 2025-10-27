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
const corregirTarea = require('../../application/useCases/corregirTarea');
const crearDespieceOT = require('../../application/useCases/crearDespieceOT');
const crearTareaPasePedido = require('../../application/useCases/crearTareaPasePedido');
// const sequelize = require("../../../.././config/db");
const sequelize=require("../../../../config/db")

const tareaRepository = new sequelizeTareaRepository();

const TareaController = {
    async crearTarea(req, res) {
        try {

            const { id } = req.usuario;
            const data = {
                ...req.body,
                usuarioId: id
            }

            const nuevoTarea = await crearTarea(data, tareaRepository, entidadService);

            res.status(nuevoTarea.codigo).json(nuevoTarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerTareas(req, res) {
        try {
            const { id, rol, nombre } = req.usuario;
            console.log(id, rol, nombre);
            const tareas = await obtenerTareas(tareaRepository, id, rol);
            res.status(200).json(tareas.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerTareaPorId(req, res) {
        try {
            const tarea = await obtenerTareaPorId(req.params.id, tareaRepository);
            res.status(tarea.codigo).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async eliminarTarea(req, res) {
        try {
            const tareaEliminado = await eliminarTarea(req.params.id, tareaRepository);
            res.status(tareaEliminado.codigo).json(tareaEliminado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async tomarTarea(req, res) {
        try {
            const tarea = await tomarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async liberarTarea(req, res) {
        try {
            const tarea = await liberarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async finalizarTarea(req, res) {
        try {
            const tarea = await finalizarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async cancelarTarea(req, res) {
        try {
            const tarea = await cancelarTarea(req.params.id, req.usuario.id, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async devolverTarea(req, res) {
        try {
            let { motivo } = req.body;
            const { id, nombre } = req.usuario;
            const tarea = await devolverTarea(req.params.id, id, motivo, nombre, tareaRepository);
            res.status(200).json(tarea.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async corregirTarea(req, res) {
        try {
            let { correccion } = req.body;
            const { id: id_usuario, nombre } = req.usuario;
            const { codigo, respuesta } = await corregirTarea(req.params.id, correccion, id_usuario, nombre, tareaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },

    async crearDespieceOT(req, res) {
        try {

            const despieceCreado = await crearDespieceOT(req.body, tareaRepository);

            res.status(despieceCreado.codigo).json(despieceCreado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        }
    },
    async crearTareaPasePedido(req,res){
        const transaction= await sequelize.transaction();
        try {
            const response=await crearTareaPasePedido(req.body,tareaRepository,transaction);
            await transaction.commit()
            res.status(response.codigo).json(response.respuesta);            
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            res.status(500).json({error:error.message})
        }
    }
};

module.exports = TareaController; 