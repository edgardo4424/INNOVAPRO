module.exports = async (clienteRepository) => {
    const clientes = await clienteRepository.obtenerClientes(); // Llama al método del repositorio para obtener todos los clientes
    return { codigo: 200, respuesta: clientes } 
} // Exporta la función para que pueda ser utilizada en otros módulos