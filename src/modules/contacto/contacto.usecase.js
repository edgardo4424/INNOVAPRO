const contactoRepository = require("./contacto.repository");
const { ErrorPersonalizado } = require("../../utils/errorPersonalizado");

/*
  En el caso de uso decide qué datos son sensibles y deben ocultarse.
*/

exports.crearContactoConRelaciones = async (data) => {
  const nuevoContacto = await contactoRepository.create(data);
  return nuevoContacto;
};

exports.actualizarContacto = async ({ id, data }) => {

  const contactoExistente = await contactoRepository.findById(id);
  if(!contactoExistente) throw ErrorPersonalizado('No se encontró contacto', 404)
 
  const contactoActualizado = await contactoRepository.update({ id, data });
  return contactoActualizado;
};

exports.obtenerContactos = async () => {
  const contactos = await contactoRepository.findAll();
  return contactos;
};

exports.obtenerUnContacto = async ({ id }) => {
  const contacto = await contactoRepository.findById(id);

  if (!contacto) throw ErrorPersonalizado("Contacto no existe", 404);

  return contacto;
};

exports.eliminarContacto = async ({ id }) => {
  return await contactoRepository.delete(id);
};