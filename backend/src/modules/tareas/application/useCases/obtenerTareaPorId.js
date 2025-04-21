module.exports = async (id, tareaRepository) => {
    const tarea = await tareaRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un tarea por ID
    if (!tarea) return { codigo: 404, respuesta: { mensaje: "Tarea no encontrado" } } // Si no se encuentra el tarea, retorna un error 404

    return { codigo: 200, respuesta: tarea } // Retorna el tarea encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos