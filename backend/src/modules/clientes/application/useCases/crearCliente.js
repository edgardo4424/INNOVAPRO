const Cliente = require("../../domain/entities/cliente"); // Importamos la entidad Cliente

module.exports = async (clienteData, clienteRepository, entidadService) => {
    
    const errorCampos = Cliente.validarCamposObligatorios(clienteData, 'crear')
    if ( errorCampos ) return { codigo: 400, respuesta: { mensaje: errorCampos } } // Validamos campos obligatorios

    const errorTipo = Cliente.validarTipoEntidad(clienteData)
    if ( errorTipo ) return { codigo: 400, respuesta: { mensaje: errorTipo } } // Validamos por tipo de cliente

    const duplicado = await entidadService.verificarDuplicados(clienteRepository.getModel(), clienteData) // Validamos los campos duplicados
    if ( duplicado ) return { codigo: 400, respuesta: { mensaje: duplicado } } // Verificamos si hay duplicados

    const nuevoClienteData = Cliente.construirDatosCliente(clienteData) // Almacenamos los datos del cliente a crear


    const nuevoCliente = await clienteRepository.crear(nuevoClienteData) // Creamos el nuevo cliente con todos sus datos en la base de datos
   
    return { codigo: 201, respuesta: { mensaje: "Cliente creado exitosamente", cliente: nuevoCliente } } // Retornamos el cliente creado
} // Exporta la función para que pueda ser utilizada en otros módulos