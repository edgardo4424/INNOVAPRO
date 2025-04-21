module.exports = async (tareaRepository) => {
    const tareas = await tareaRepository.obtenerTareas(); // Llama al método del repositorio para obtener todos los tareas
    return { codigo: 200, respuesta: tareas } 
} // Exporta la función para que pueda ser utilizada en otros módulos