module.exports = async (clienteRepository) => {
    const clientes = await clienteRepository.obtenerClientes(); // Llama al método del repositorio para obtener todos los clientes

    const clientesMapeados = clientes.map(cliente => cliente.get({ plain: true }));
    return { codigo: 200, respuesta: clientesMapeados } 
} // Exporta la función para que pueda ser utilizada en otros módulos