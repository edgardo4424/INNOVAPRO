module.exports = async (body, guiaRemisionRepository) => {

    const { detalle, chofer, transportista, sunat_respuesta, ...guia } = body



    const { success, message, data: resultadoCreacion } = await guiaRemisionRepository.crear({
        guia,
        detalle,
        sunat_respuesta,
        chofer: chofer,
        transportista: transportista
    });

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