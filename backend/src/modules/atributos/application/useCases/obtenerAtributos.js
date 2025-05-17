module.exports = async (atributoRepository) => {
    const atributos = await atributoRepository.obtenerAtributos(); // Llama al método del repositorio para obtener todos los atributos
    return { codigo: 200, respuesta: atributos } 
} // Exporta la función para que pueda ser utilizada en otros módulos