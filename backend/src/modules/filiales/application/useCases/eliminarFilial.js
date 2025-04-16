module.exports = async (id, filialRepository) => {
    const filial = await filialRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un filial por ID
    if (!filial) return { codigo: 404, respuesta: { mensaje: "Filial no encontrado" } } // Si no se encuentra el filial, retorna un error 404

    await filialRepository.eliminarFilial(id); // Llama al método del repositorio para eliminar el usuaro por ID
    return { codigo: 200, respuesta: { mensaje: "Filial eliminado exitosamente" } } // Retorna un mensaje de éxito
}