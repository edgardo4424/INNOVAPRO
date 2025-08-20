module.exports = async (dataBody, gratificacionRepository) => {

    const { periodo, anio, filial_id } = dataBody;
    const gratificaciones = await gratificacionRepository.obtenerGratificacionesCerradas(periodo, anio, filial_id); // Llama al método del repositorio para obtener todos los gratificaciones
    return { codigo: 200, respuesta: gratificaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos