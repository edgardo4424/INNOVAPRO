module.exports = async (periodo, anio, filial_id, trabajador_id, gratificacionRepository) => {

    const gratificaciones = await gratificacionRepository.obtenerTotalGratificacionPorTrabajador(periodo, anio, filial_id, trabajador_id); // Llama al método del repositorio para obtener todos los gratificaciones
    return { codigo: 200, respuesta: gratificaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos