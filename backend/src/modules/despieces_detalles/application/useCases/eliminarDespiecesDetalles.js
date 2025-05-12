module.exports = async (id, despiecesDetallesRepository) => {
    const despiecesDetalles = await despiecesDetallesRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un despiecesDetalles por ID
    if (!despiecesDetalles) return { codigo: 404, respuesta: { mensaje: "Despieces Detalles no encontrada" } } // Si no se encuentra el despiecesDetalles, retorna un error 404

    await despiecesDetallesRepository.eliminarDespieceDetalle(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Despieces Detalles eliminada exitosamente" } } // Retorna un mensaje de éxito
}