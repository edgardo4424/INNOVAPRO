module.exports = async (id, contactoRepository) => {
    const contacto = await contactoRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un contacto por ID
    if (!contacto) return { codigo: 404, respuesta: { mensaje: "Contacto no encontrado" } } // Si no se encuentra el contacto, retorna un error 404

    await contactoRepository.eliminarContacto(id); // Llama al método del repositorio para eliminar el contacot por ID
    return { codigo: 200, respuesta: { mensaje: "Contacto eliminado exitosamente" } } // Retorna un mensaje de éxito
}