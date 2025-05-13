module.exports = async (despiecesDetallesRepository) => {
    const despiecesDetalles = await despiecesDetallesRepository.obtenerDespiecesDetalle(); // Llama al método del repositorio para obtener todos los despiecesDetalles
    return { codigo: 200, respuesta: despiecesDetalles } 
} // Exporta la función para que pueda ser utilizada en otros módulos