module.exports = async (id, obraRepository) => {
    const obra = await obraRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un obra por ID
    if (!obra) return { codigo: 404, respuesta: { mensaje: "obra no encontrada" } } // Si no se encuentra el obra, retorna un error 404

    await obraRepository.eliminarObra(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Obra eliminada exitosamente" } } // Retorna un mensaje de éxito
}