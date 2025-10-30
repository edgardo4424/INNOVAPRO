

module.exports = async (dataDocumento,documentoRepository, transaction=null)=>{
  
    // Guardar el documento en la base de datos
    const documento_creado = await documentoRepository.crearDocumento(dataDocumento, transaction);

    return{
        codigo:200,
        respuesta:{
            mensaje:"Documento guardado exitosamente",
            documento:documento_creado
        }
    }
}

