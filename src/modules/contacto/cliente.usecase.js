const clienteRepository = require("./cliente.repository");
const { ErrorPersonalizado } = require("../../utils/errorPersonalizado");

/*
  En el caso de uso decide qué datos son sensibles y deben ocultarse.
*/

exports.crearCliente = async (data) => {
  const nuevoCliente = await clienteRepository.create(data);
  return nuevoCliente;
};

exports.actualizarCliente = async ({ id, data }) => {

  const clienteExistente = await clienteRepository.findById(id);
  if(!clienteExistente) throw ErrorPersonalizado('No se encontró cliente', 404)
 
  const clienteActualizado = await clienteRepository.update({ id, data });
  return clienteActualizado;
};

exports.obtenerClientes = async () => {
  const clientes = await clienteRepository.findAll();
  return clientes;
};

exports.obtenerUnCliente = async ({ id }) => {
  const cliente = await clienteRepository.findById(id);

  if (!cliente) throw ErrorPersonalizado("Cliente no existe", 404);

  return cliente;
};

exports.eliminarCliente = async ({ id }) => {
  return await clienteRepository.delete(id);
};