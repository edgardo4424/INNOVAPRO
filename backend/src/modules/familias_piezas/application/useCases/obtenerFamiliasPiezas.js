module.exports = async (familiasPiezasRepository) => {
    const familiasPiezas = await familiasPiezasRepository.obtenerFamiliasPiezas(); // Llama al método del repositorio para obtener todos las familias
    return { codigo: 200, respuesta: familiasPiezas } 
} // Exporta la función para que pueda ser utilizada en otros módulos