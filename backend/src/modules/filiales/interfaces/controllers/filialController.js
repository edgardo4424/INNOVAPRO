const sequelizeFilialRepository = require('../../infrastructure/repositories/sequelizeFilialRepository'); // Importamos el repositorio de Filials

const entidadService = require('../../infrastructure/services/entidadService'); // Importamos el servicio de entidades

const crearFilial = require('../../application/useCases/crearFilial'); // Importamos el caso de uso para crear un Filial
const obtenerFiliales = require('../../application/useCases/obtenerFiliales'); // Importamos el caso de uso para obtener todos los Filials
const obtenerFilialPorId = require('../../application/useCases/obtenerFilialPorId'); // Importamos el caso de uso para obtener un Filial por ID
const actualizarFilial = require('../../application/useCases/actualizarFilial'); // Importamos el caso de uso para actualizar un Filial
const eliminarFilial = require('../../application/useCases/eliminarFilial'); // Importamos el caso de uso para eliminar un Filial

const filialRepository = new sequelizeFilialRepository(); // Instancia del repositorio de filials

const FilialController = {
    async crearFilial(req, res) {
        try {
          
            const nuevoFilial = await crearFilial(req.body, filialRepository, entidadService ); // Llamamos al caso de uso para crear un Filial
           
            res.status(nuevoFilial.codigo).json(nuevoFilial.respuesta); // Respondemos con el Filial creado
        } catch (error) {
        
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerFiliales(req, res) {
        try {
            const filiales = await obtenerFiliales(filialRepository); // Llamamos al caso de uso para obtener todos los filiales
           
            res.status(200).json(filiales.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerFilialPorId(req, res) {
        try {
            const filial = await obtenerFilialPorId(req.params.id, filialRepository); // Llamamos al caso de uso para obtener un filial por ID
            res.status(filial.codigo).json(filial.respuesta); // Respondemos con el filial solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarFilial(req, res) {
        try {
            const filialActualizado = await actualizarFilial(req.params.id, req.body, filialRepository, entidadService); // Llamamos al caso de uso para actualizar un filial
            
            res.status(filialActualizado.codigo).json(filialActualizado.respuesta); // Respondemos con el filial actualizado
        } catch (error) {
            
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarFilial(req, res) {
        try {
            const filialEliminado = await eliminarFilial(req.params.id, filialRepository); // Llamamos al caso de uso para eliminar un filial
            res.status(filialEliminado.codigo).json(filialEliminado.respuesta); // Respondemos con el filial eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }

};

module.exports = FilialController; // Exportamos el controlador de Filials