module.exports = async (contrato_id, contratoRepository, transaction = null) => {

    const contratoConSusDocumentos = await contratoRepository.obtenerDocumentosPorCodigoContrato(contrato_id, transaction); // Llama al método del repositorio para obtener todos los documentos del contrato

    const contratosConDocumentos = contratoConSusDocumentos.get({ plain: true });
    const {documentos, ...resto} = contratosConDocumentos

    const documentosFormateados = documentos.map((documento) => {
        const {contrato_id, ...restoDocumento} = documento;
        return { ...restoDocumento };
    });

    const respuesta = {
        resumen: {
            contrato_id: resto.id,
            codigo_contrato: resto.ref_contrato,
            filial_id: resto.filial_id,
            uso_id: resto.uso_id,
            oficializado: false,
            docx_ultimo_url: null
        },
        historial: documentosFormateados
    }
    return { codigo: 200, respuesta: respuesta } 
} // Exporta la función para que pueda ser utilizada en otros módulos