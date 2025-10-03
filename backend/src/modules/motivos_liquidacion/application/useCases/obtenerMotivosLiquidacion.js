module.exports = async (motivosLiquidacionRepository) => {
    const motivosLiquidacion = await motivosLiquidacionRepository.obtenerMotivosLiquidacion();
    return { codigo: 200, respuesta: motivosLiquidacion } 
} 