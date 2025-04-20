const sequelizeContactoRepository = require('../../infrastructure/repositories/sequelizeContactoRepository');
const entidadService = require('../../infrastructure/services/entidadService'); 

const crearContacto = require('../../application/useCases/crearContacto'); 
const obtenerContactos = require('../../application/useCases/obtenerContactos'); 
const obtenerContactoPorId = require('../../application/useCases/obtenerContactoPorId'); 
const actualizarContacto = require('../../application/useCases/actualizarContacto'); 
const eliminarContacto = require('../../application/useCases/eliminarContacto'); 

const contactoRepository = new sequelizeContactoRepository(); 

const ContactoController = {
    async crearContacto(req, res) {
        try {
            const nuevoContacto = await crearContacto(req.body, contactoRepository, entidadService );
           
            res.status(nuevoContacto.codigo).json(nuevoContacto.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async obtenerContactos(req, res) {
        try {
            const contactos = await obtenerContactos(contactoRepository);
          
            res.status(200).json(contactos.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async obtenerContactoPorId(req, res) {
        try {
            const contacto = await obtenerContactoPorId(req.params.id, contactoRepository); 
            res.status(contacto.codigo).json(contacto.respuesta);
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async actualizarContacto(req, res) {
        try {
            const contactoActualizado = await actualizarContacto(req.params.id, req.body, contactoRepository, entidadService);
            res.status(contactoActualizado.codigo).json(contactoActualizado.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    },

    async eliminarContacto(req, res) {
        try {
            const contactoEliminado = await eliminarContacto(req.params.id, contactoRepository); 
            res.status(contactoEliminado.codigo).json(contactoEliminado.respuesta); 
        } catch (error) {
            console.log('error',error);
            res.status(500).json({ error: error.message }); 
        }
    }

};

module.exports = ContactoController; 