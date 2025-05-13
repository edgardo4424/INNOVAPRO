module.exports = async (id, piezaRepository) => {
    const pieza = await piezaRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un pieza por ID
    if (!pieza) return { codigo: 404, respuesta: { mensaje: "Pieza no encontrada" } } // Si no se encuentra la pieza, retorna un error 404

    await piezaRepository.eliminarPieza(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Pieza eliminada exitosamente" } } // Retorna un mensaje de éxito
}