module.exports = async (item, piezaRepository,transaction=null) => {
    const pieza = await piezaRepository.obtenerPiezaPorItem(item,transaction); // Llama al método del repositorio para obtener un pieza por ID
    if (!pieza) return { codigo: 404, respuesta: { mensaje: "Pieza no encontrado" } } // Si no se encuentra la Pieza, retorna un error 404

    return { codigo: 200, respuesta: pieza } // Retorna la pieza encontrada
} // Exporta la función para que pueda ser utilizada en otros módulos