const Cliente = require("../../domain/entities/cliente"); // Importamos la entidad Cliente

module.exports = async (id, clienteData, clienteRepository, entidadService) => {
    const cliente = await clienteRepository.obtenerPorId(id); // Llama al método del repositorio para obtener el cliente por ID
    if (!cliente) return { codigo: 404, respuesta: { mensaje: "Cliente no encontrado" } } // Si no se encuentra el cliente, retorna un error 404

    const errorCampos = Cliente.validarCamposObligatorios(clienteData, 'editar');
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Validamos campos obligatorios

    const errorTipo = Cliente.validarTipoEntidad(clienteData)
    if ( errorTipo ) return { codigo: 400, respuesta: { mensaje: errorTipo } } // Validamos por tipo de cliente

    const duplicado = await entidadService.verificarDuplicados(clienteRepository.getModel(), clienteData, id) // Validamos los campos duplicados
    if ( duplicado ) return { codigo: 400, respuesta: { mensaje: duplicado } } // Verificamos si hay duplicados

    const datosActualizados = Cliente.construirDatosCliente(clienteData) // Almacenamos los datos del cliente a actualizar
    const clienteActualizado = await clienteRepository.actualizarCliente(id, datosActualizados) // Actualizamos el cliente en la base de datos

    return { codigo: 200, respuesta: { mensaje: "Cliente actualizado exitosamente", cliente: clienteActualizado } } // Retornamos el cliente actualizado
} // Exporta la función para que pueda ser utilizada en otros módulos