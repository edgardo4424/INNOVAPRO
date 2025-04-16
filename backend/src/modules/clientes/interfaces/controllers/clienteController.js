const sequelizeClienteRepository = require('../../infrastructure/repositories/sequelizeClienteRepository'); // Importamos el repositorio de clientes
const entidadService = require('../../infrastructure/services/entidadService'); // Importamos el servicio de entidades

const crearCliente = require('../../application/useCases/crearCliente'); // Importamos el caso de uso para crear un cliente
const obtenerClientes = require('../../application/useCases/obtenerClientes'); // Importamos el caso de uso para obtener todos los clientes
const obtenerClientePorId = require('../../application/useCases/obtenerClientePorId'); // Importamos el caso de uso para obtener un cliente por ID
const actualizarCliente = require('../../application/useCases/actualizarCliente'); // Importamos el caso de uso para actualizar un cliente
const eliminarCliente = require('../../application/useCases/eliminarCliente'); // Importamos el caso de uso para eliminar un cliente

const clienteRepository = new sequelizeClienteRepository(); // Instancia del repositorio de clientes

const ClienteController = {
    async crearCliente(req, res) {
        try {
            const nuevoCliente = await crearCliente(req.body, clienteRepository, entidadService ); // Llamamos al caso de uso para crear un cliente
           
            res.status(nuevoCliente.codigo).json(nuevoCliente.respuesta); // Respondemos con el cliente creado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerClientes(req, res) {
        try {
            const clientes = await obtenerClientes(clienteRepository); // Llamamos al caso de uso para obtener todos los clientes
          
            res.status(200).json(clientes.respuesta); // Respondemos con un json de clientes
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async obtenerClientePorId(req, res) {
        try {
            const cliente = await obtenerClientePorId(req.params.id, clienteRepository); // Llamamos al caso de uso para obtener un cliente por ID
            res.status(cliente.codigo).json(cliente.respuesta); // Respondemos con el cliente solicitado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async actualizarCliente(req, res) {
        try {
            const clienteActualizado = await actualizarCliente(req.params.id, req.body, clienteRepository, entidadService); // Llamamos al caso de uso para actualizar un cliente
            res.status(clienteActualizado.codigo).json(clienteActualizado.respuesta); // Respondemos con el cliente actualizado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    },

    async eliminarCliente(req, res) {
        try {
            const clienteEliminado = await eliminarCliente(req.params.id, clienteRepository); // Llamamos al caso de uso para eliminar un cliente
            res.status(clienteEliminado.codigo).json(clienteEliminado.respuesta); // Respondemos con el cliente eliminado
        } catch (error) {
            res.status(500).json({ error: error.message }); // Respondemos con un error
        }
    }

};

module.exports = ClienteController; // Exportamos el controlador de clientes