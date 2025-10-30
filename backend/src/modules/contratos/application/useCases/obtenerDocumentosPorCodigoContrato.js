module.exports = async (contrato_id, contratoRepository, transaction = null) => {

    const contratoConSusDocumentos = await contratoRepository.obtenerDocumentosPorCodigoContrato(contrato_id, transaction); // Llama al método del repositorio para obtener todos los documentos del contrato

    const contratosConDocumentos = contratoConSusDocumentos.get({ plain: true });
    const {documentos, ...resto} = contratosConDocumentos

    const respuesta = {
        contrato: {
            ...resto
        },
        documentos
    }
    return { codigo: 200, respuesta: respuesta } 
} // Exporta la función para que pueda ser utilizada en otros módulos