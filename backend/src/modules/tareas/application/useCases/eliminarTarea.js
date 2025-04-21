module.exports = async (id, tareaRepository) => {
    const tarea = await tareaRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un tarea por ID
    if (!tarea) return { codigo: 404, respuesta: { mensaje: "tarea no encontrada" } } // Si no se encuentra el tarea, retorna un error 404

    await tareaRepository.eliminarTarea(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Tarea eliminada exitosamente" } } // Retorna un mensaje de éxito
}