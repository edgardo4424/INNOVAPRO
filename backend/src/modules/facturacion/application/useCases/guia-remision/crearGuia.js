module.exports = async (body, guiaRemisionRepository) => {

    let transporte = [];

    const { detalle, chofer, transportista,sunat_respuesta, ...guia } = body

    if (transportista && chofer == undefined) {
        transporte.push(transportista)
    } else {
        transporte = chofer;
    }


    const { success, message, data: resultadoCreacion } = await guiaRemisionRepository.crear({
        guia,
        detalle,
        sunat_respuesta,
        chofer: transporte
    });

    console.log("resultadoCreacion", success, message, resultadoCreacion);
    if (!success) {
        return {
            codigo: 400,
            respuesta: {
                success: success,
                message: message || "La guia de remision no se creo correctamente.",
                data: null,
                status: 400
            }
        };
    }

    return {
        codigo: 201,
        respuesta: {
            success: success,
            message: message || "La guia de remision se creo correctamente.",
            data: null,
            status: 201
        }
    };
}