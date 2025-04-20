const Contacto = require("../../domain/entities/contacto"); // Importamos la entidad contacto

module.exports = async (contactoData, contactoRepository, entidadService) => {
    const errorCampos = Contacto.validarCamposObligatorios(contactoData, 'crear')
    if ( errorCampos ) return { codigo: 400, respuesta: { mensaje: errorCampos } } // Validamos campos obligatorios

    const nuevoContactoData = Contacto.construirDatosContacto(contactoData) // Almacenamos los datos del contacto a crear
    const nuevoContacto = await contactoRepository.crear(nuevoContactoData) // Creamos el nuevo contacto con todos sus datos en la base de datos
    
    return { codigo: 201, respuesta: { mensaje: "Contacto creado exitosamente", contacto: nuevoContacto } } // Retornamos el contacto creado
} // Exporta la función para que pueda ser utilizada en otros módulos