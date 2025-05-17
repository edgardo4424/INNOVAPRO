module.exports = async (despieceRepository) => {
    const despieces = await despieceRepository.obtenerDespieces(); // Llama al método del repositorio para obtener todos los despieces 
    return { codigo: 200, respuesta: despieces } 
} // Exporta la función para que pueda ser utilizada en otros módulos