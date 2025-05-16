module.exports = async (cotizacionesTransporteRepository) => {
    const cotizacionesTransporte = await cotizacionesTransporteRepository.obtenerCotizacionesTransporte();
    return { codigo: 200, respuesta: cotizacionesTransporte } 
} 