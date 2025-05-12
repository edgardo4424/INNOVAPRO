module.exports = async (uso_id, atributoRepository) => {
    const atributos = await atributoRepository.obtenerAtributosPorUsoId(uso_id); // Llama al método del repositorio para obtener todos los atributos
    return { codigo: 200, respuesta: atributos } 
} // Exporta la función para que pueda ser utilizada en otros módulos