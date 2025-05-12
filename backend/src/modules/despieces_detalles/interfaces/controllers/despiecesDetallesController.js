const sequelizeDespieceDetalleRepository = require('../../infrastructure/repositories/sequelizeDespieceDetalleRepository'); // Importamos el repositorio de despieces detalle

const crearDespieceDetalle = require('../../application/useCases/crearDespiecesDetalles'); // Importamos el caso de uso para crear un despiece detalle
const obtenerDespiecesDetalle = require('../../application/useCases/obtenerDespiecesDetalle'); // Importamos el caso de uso para obtener todos los despiece detalles
const obtenerDespieceDetallePorId = require('../../application/useCases/obtenerDespiecesDetallesPorId'); // Importamos el caso de uso para obtener un despiece detalle por ID
const actualizarDespieceDetalle = require('../../application/useCases/actualizarDespiecesDetalles'); // Importamos el caso de uso para actualizar un despiece detalle
const eliminarDespieceDetalle = require('../../application/useCases/eliminarDespiecesDetalles'); // Importamos el caso de uso para eliminar un despiece detalle
const crearVariosDespiecesDetalles = require('../../application/useCases/crearVariosDespiecesDetalles')

const despieceDetalleRepository = new sequelizeDespieceDetalleRepository(); // Instancia del repositorio de despiece detalles

const DespieceDetalleController = {
    async crearDespieceDetalle(req, res) {
        try {
            const nuevoDespieceDetalle = await crearDespieceDetalle(req.body, despieceDetalleRepository ); // Llamamos al caso de uso para crear un despiece detalle
           
            res.status(nuevoDespieceDetalle.codigo).json(nuevoDespieceDetalle.respuesta); // Respondemos con el despiece detalle creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerDespiecesDetalle(req, res) {
        try {
            const despieces_detalle = await obtenerDespiecesDetalle(despieceDetalleRepository); // Llamamos al caso de uso para obtener todos los despieces detalles
           
            res.status(200).json(despieces_detalle.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerDespieceDetallePorId(req, res) {
        try {
            const despieces_detalle = await obtenerDespieceDetallePorId(req.params.id, despieceDetalleRepository); // Llamamos al caso de uso para obtener un despiece detalle por ID
            res.status(despieces_detalle.codigo).json(despieces_detalle.respuesta); // Respondemos con el despiece detalle solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarDespieceDetalle(req, res) {
        try {
            const despieceDetalleActualizado = await actualizarDespieceDetalle(req.params.id, req.body, despieceDetalleRepository); // Llamamos al caso de uso para actualizar un despiece detalle
            
            res.status(despieceDetalleActualizado.codigo).json(despieceDetalleActualizado.respuesta); // Respondemos con el despiece detalle actualizado
        } catch (error) {
            
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarDespieceDetalle(req, res) {
        try {
            const despieceDetalleEliminado = await eliminarDespieceDetalle(req.params.id, despieceDetalleRepository); // Llamamos al caso de uso para eliminar un despiece detalle
            res.status(despieceDetalleEliminado.codigo).json(despieceDetalleEliminado.respuesta); // Respondemos con el despiece detalle eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async crearVariosDespiecesDetalles(req, res) {
        try {
            
            const variosDespiecesDetalles = await crearVariosDespiecesDetalles(req.body, despieceDetalleRepository); // Llamamos al caso de uso para eliminar un despiece detalle
            res.status(variosDespiecesDetalles.codigo).json(variosDespiecesDetalles.respuesta); // Respondemos con el despiece detalle eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }

};

module.exports = DespieceDetalleController; // Exportamos el controlador de despiece detalles