module.exports = async (periodo, anio, gratificacionRepository) => {
    const gratificaciones = await gratificacionRepository.calcularGratificaciones(periodo, anio); 
    return { codigo: 200, respuesta: gratificaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos