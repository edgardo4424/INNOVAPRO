module.exports = async (id, despieceRepository) => {

    const despiece = await despieceRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un despiece por ID
    if (!despiece) return { codigo: 404, respuesta: { mensaje: "Despiece no encontrada" } } // Si no se encuentra el despiece, retorna un error 404

    await despieceRepository.eliminarDespiece(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Despiece eliminada exitosamente" } } // Retorna un mensaje de éxito
}