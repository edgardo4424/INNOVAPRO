module.exports = async (distritosTransporteRepository) => {
    const distritosTransporte = await distritosTransporteRepository.obtenerDistritosTransporte();
    return { codigo: 200, respuesta: distritosTransporte } 
} 