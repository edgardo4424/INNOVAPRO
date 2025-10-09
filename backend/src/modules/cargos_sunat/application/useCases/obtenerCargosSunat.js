module.exports = async (cargo_innova_id, cargosSunatRepository) => {
    const cargosSunat = await cargosSunatRepository.obtenerCargosSunat(cargo_innova_id);
    return { codigo: 200, respuesta: cargosSunat } 
} 