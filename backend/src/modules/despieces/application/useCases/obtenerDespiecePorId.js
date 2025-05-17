module.exports = async (id, despieceRepository) => {
    const despiece = await despieceRepository.obtenerDespiecePorId(id); // Llama al método del repositorio para obtener un Despiece por ID
    if (!despiece) return { codigo: 404, respuesta: { mensaje: "Despiece no encontrado" } } // Si no se encuentra el Despiece, retorna un error 404

    return { codigo: 200, respuesta: despiece } // Retorna el despiece encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos