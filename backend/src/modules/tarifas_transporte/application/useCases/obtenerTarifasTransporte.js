module.exports = async (tarifasTransporteRepository) => {
    const tarifasTransporte = await tarifasTransporteRepository.obtenerTarifasTransporte();
    return { codigo: 200, respuesta: tarifasTransporte } 
} 