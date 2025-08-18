module.exports = async (body, guiaRemisionRepository) => {

    // const { success, message, data } = GuiaRemision.crear(body);

    // if (!success) {
    //     return {
    //         codigo: 400,
    //         respuesta: {
    //             success: success,
    //             message: message,
    //             data: null,
    //         },
    //     };
    // }

    const { detalle, chofer, sunat_respuesta, ...guia } = body;

    const guiaRemision = {
        detalle: detalle,
        chofer: chofer,
        sunat_respuesta
    }

    guiaRemision.guia = guia;
    const { success, message, data: resultadoCreacion } = await guiaRemisionRepository.crear(guiaRemision);

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