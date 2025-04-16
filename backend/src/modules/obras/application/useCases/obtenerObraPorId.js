module.exports = async (id, obraRepository) => {
    const obra = await obraRepository.obtenerObraPorId(id); // Llama al método del repositorio para obtener un Obra por ID
    if (!obra) return { codigo: 404, respuesta: { mensaje: "Obra no encontrado" } } // Si no se encuentra el Obra, retorna un error 404

    return { codigo: 200, respuesta: obra } // Retorna el obra encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos