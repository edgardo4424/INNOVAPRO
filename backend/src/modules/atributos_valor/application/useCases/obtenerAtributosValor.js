module.exports = async (atributosValorRepository) => {
    const atributosValor = await atributosValorRepository.obtenerAtributosValor(); // Llama al método del repositorio para obtener todos los atributosValor
    return { codigo: 200, respuesta: atributosValor } 
} // Exporta la función para que pueda ser utilizada en otros módulos