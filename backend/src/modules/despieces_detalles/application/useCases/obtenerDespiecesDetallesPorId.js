module.exports = async (id, despiecesDetallesRepository) => {
    const despiecesDetalles = await despiecesDetallesRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un despiecesDetalle por ID
    if (!despiecesDetalles) return { codigo: 404, respuesta: { mensaje: "Despieces detalles no encontrado" } } // Si no se encuentra el despieces detalless, retorna un error 404

    return { codigo: 200, respuesta: despiecesDetalles } // Retorna el despieces detalle encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos