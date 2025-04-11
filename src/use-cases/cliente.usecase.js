const clienteRepository = require('../repositories/cliente.repository');

exports.crearCliente = async (data) => clienteRepository.create(data);
exports.obtenerClientes = async () => clienteRepository.findAll();
exports.obtenerCotizacionesPorCliente = async (clienteId) => clienteRepository.findCotizacionesByClienteId(clienteId);
