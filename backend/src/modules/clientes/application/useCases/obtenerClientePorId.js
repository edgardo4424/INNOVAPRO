module.exports = async (id, clienteRepository) => {
    const cliente = await clienteRepository.obtenerClientePorId(id); // Llama al método del repositorio para obtener un cliente por ID
    if (!cliente) return { codigo: 404, respuesta: { mensaje: "Cliente no encontrado" } } // Si no se encuentra el cliente, retorna un error 404

    return { codigo: 200, respuesta: cliente } // Retorna el cliente encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos