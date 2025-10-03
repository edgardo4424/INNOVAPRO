module.exports = async (clienteRepository) => {
    const clientes = await clienteRepository.obtenerClientes(); // Llama al método del repositorio para obtener todos los clientes
    const clientesMapeados = clientes.map(cliente => cliente.get({ plain: true }));

    const listaClientes = clientesMapeados.map(cliente => ({
        ...cliente,
        contactos_asociados: cliente.contactos_asociados.map(contacto => contacto.id),
        obras_asociadas: cliente.obras_asociadas.map(obra => obra.id),
    }));

    return { codigo: 200, respuesta: listaClientes } 
} // Exporta la función para que pueda ser utilizada en otros módulos