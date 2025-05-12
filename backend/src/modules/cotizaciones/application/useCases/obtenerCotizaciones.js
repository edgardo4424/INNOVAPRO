module.exports = async (cotizacionRepository) => {
    const cotizaciones = await cotizacionRepository.obtenerCotizaciones(); // Llama al método del repositorio para obtener todos los cotizaciones
    return { codigo: 200, respuesta: cotizaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos