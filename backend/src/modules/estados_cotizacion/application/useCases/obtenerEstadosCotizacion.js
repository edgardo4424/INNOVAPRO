module.exports = async (estadosCotizacionRepository) => {
    const estadosCotizacion = await estadosCotizacionRepository.obtenerEstadosCotizacion(); // Llama al método del repositorio para obtener todos los obras
    return { codigo: 200, respuesta: estadosCotizacion } 
} // Exporta la función para que pueda ser utilizada en otros módulos