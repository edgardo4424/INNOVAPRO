module.exports = async (id, clienteRepository) => {
    const cliente = await clienteRepository.obtenerPorId(id); // Llama al método del repositorio para obtener un cliente por ID
    if (!cliente) return { codigo: 404, respuesta: { mensaje: "Cliente no encontrado" } } // Si no se encuentra el cliente, retorna un error 404

    await clienteRepository.eliminarCliente(id); // Llama al método del repositorio para eliminar el cliente por ID
    return { codigo: 200, respuesta: { mensaje: "Cliente eliminado exitosamente" } } // Retorna un mensaje de éxito
}