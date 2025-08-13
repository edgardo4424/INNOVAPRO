module.exports = async (gratificacionRepository) => {
    const gratificaciones = await gratificacionRepository.obtenerGratificaciones(); // Llama al método del repositorio para obtener todos los gratificaciones
    return { codigo: 200, respuesta: gratificaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos