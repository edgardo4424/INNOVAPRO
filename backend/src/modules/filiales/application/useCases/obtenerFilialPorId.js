module.exports = async (id, filialRepository) => {
    const filial = await filialRepository.obtenerFilialPorId(id); // Llama al método del repositorio para obtener un filial por ID
    if (!filial) return { codigo: 404, respuesta: { mensaje: "Filial no encontrado" } } // Si no se encuentra el filial, retorna un error 404

    return { codigo: 200, respuesta: filial } // Retorna el filial encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos