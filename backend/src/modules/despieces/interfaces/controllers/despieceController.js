const sequelizeDespieceRepository = require('../../infrastructure/repositories/sequelizeDespieceRepository'); // Importamos el repositorio de despieces

const crearDespiece = require('../../application/useCases/crearDespiece'); // Importamos el caso de uso para crear un despiece
const generarDespieceAndamioDeTrabajo = require('../../application/useCases/generarDespieceAndamioDeTrabajo')
const generarDespiecePuntales = require('../../application/useCases/generarDespiecePuntales')
const generarDespieceEscalera = require('../../application/useCases/generarDespieceEscalera')
const generarDespiecePlataformaDescarga = require('../../application/useCases/generarDespiecePlataformaDescarga');
const generarDespieceEscuadras = require('../../application/useCases/generarDespieceEscuadras');
const generarDespieceColgante = require('../../application/useCases/generarDespieceColgante');
const generarDespieceAndamioDeFachada = require('../../application/useCases/generarDespieceAndamioDeFachada');

const obtenerDespieces = require('../../application/useCases/obtenerDespieces'); // Importamos el caso de uso para obtener todos los despieces
const obtenerDespiecePorId = require('../../application/useCases/obtenerDespiecePorId'); // Importamos el caso de uso para obtener un despiece por ID
const actualizarDespiece = require('../../application/useCases/actualizarDespiece'); // Importamos el caso de uso para actualizar un despiece
const eliminarDespiece = require('../../application/useCases/eliminarDespiece'); // Importamos el caso de uso para eliminar un despiece


const despieceRepository = new sequelizeDespieceRepository(); // Instancia del repositorio de despieces

const DespieceController = {
    async crearDespiece(req, res) {
        try {
      
           
            const nuevoDespiece = await crearDespiece(req.body, despieceRepository ); // Llamamos al caso de uso para crear un despiece
           
            res.status(nuevoDespiece.codigo).json(nuevoDespiece.respuesta); // Respondemos con el despiece creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async generarDespieceAndamioDeFachada(req, res) {
        try {

            const despieceGenerado = await generarDespieceAndamioDeFachada(req.body );             
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta);
            // Respondemos con el despiece creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },
    async generarDespieceAndamioDeTrabajo(req, res) {
        try {

            const despieceGenerado = await generarDespieceAndamioDeTrabajo(req.body ); // Llamamos al caso de uso para crear un despiece
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta); // Respondemos con el despiece creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async generarDespiecePuntales(req, res) {
        try {

            const despieceGenerado = await generarDespiecePuntales(req.body, despieceRepository ); // Llamamos al caso de uso para crear un despiece
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta); // Respondemos con el despiece creado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

     async generarDespieceEscalera(req, res) {
        try {

            const despieceGenerado = await generarDespieceEscalera(req.body, despieceRepository ); 
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); 
        }
    },

     async generarDespiecePlataformaDescarga(req, res) {
        try {

            const despieceGenerado = await generarDespiecePlataformaDescarga(req.body, despieceRepository ); 
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); 
        }
    },

     async generarDespieceEscuadras(req, res) {
        try {

            const despieceGenerado = await generarDespieceEscuadras(req.body, despieceRepository ); 
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); 
        }
    },

     async generarDespieceColgante(req, res) {
        try {

            const despieceGenerado = await generarDespieceColgante(req.body); 
           
            res.status(despieceGenerado.codigo).json(despieceGenerado.respuesta);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); 
        }
    },


    async obtenerDespieces(req, res) {
        try {
            const despieces = await obtenerDespieces(despieceRepository); // Llamamos al caso de uso para obtener todos los despieces
           
            res.status(200).json(despieces.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerDespiecePorId(req, res) {
        try {
            const despiece = await obtenerDespiecePorId(req.params.id, despieceRepository); // Llamamos al caso de uso para obtener un despiece por ID
            res.status(despiece.codigo).json(despiece.respuesta); // Respondemos con el despiece solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarDespiece(req, res) {
        try {
           
            const despieceActualizado = await actualizarDespiece(req.params.id, req.body, despieceRepository); // Llamamos al caso de uso para actualizar un despiece
            
            res.status(despieceActualizado.codigo).json(despieceActualizado.respuesta); // Respondemos con el despiece actualizado
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarDespiece(req, res) {
        try {
            
            const despieceEliminado = await eliminarDespiece(req.params.id, despieceRepository); // Llamamos al caso de uso para eliminar un despiece
            res.status(despieceEliminado.codigo).json(despieceEliminado.respuesta); // Respondemos con el despiece eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

};

module.exports = DespieceController; // Exportamos el controlador de despieces