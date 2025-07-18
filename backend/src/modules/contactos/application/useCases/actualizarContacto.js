const Contacto = require("../../domain/entities/contacto"); // Importamos la entidad contacto

module.exports = async (id, contactoData, contactoRepository, entidadService) => {

    const contacto = await contactoRepository.obtenerPorId(id); // Llama al método del repositorio para obtener el contacto por ID
    if (!contacto) return { codigo: 404, respuesta: { mensaje: "Contacto no encontrado" } } // Si no se encuentra el contacto, retorna un error 404

    const errorCampos = Contacto.validarCamposObligatorios(contactoData, 'editar');
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Validamos campos obligatorios

    const datosActualizados = Contacto.construirDatosContacto(contactoData) // Almacenamos los datos del Contacto a actualizar
    const contactoActualizado = await contactoRepository.actualizarContacto(id, datosActualizados) // Actualizamos el contacto en la base de datos


    return { codigo: 200, respuesta: { mensaje: "Contacto actualizado exitosamente", contacto: contactoActualizado } } // Retornamos el contacto actualizado
} // Exporta la función para que pueda ser utilizada en otros módulos