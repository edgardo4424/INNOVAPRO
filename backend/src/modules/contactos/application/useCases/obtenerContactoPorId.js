module.exports = async (id, contactoRepository) => {
    const contacto = await contactoRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un contacto por ID
    if (!contacto) return { codigo: 404, respuesta: { mensaje: "Contacto no encontrado" } } // Si no se encuentra el contacto, retorna un error 404

    return { codigo: 200, respuesta: contacto } // Retorna el contacto encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos