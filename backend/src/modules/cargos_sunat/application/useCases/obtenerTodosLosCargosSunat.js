module.exports = async (cargosSunatRepository) => {
    const cargosSunat = await cargosSunatRepository.obtenerTodosLosCargosSunat();
    return { codigo: 200, respuesta: cargosSunat } 
} 