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
        detalles: detalle,
        choferes: chofer,
        sunat_respuesta
    }

    guiaRemision.guia = guia;
    const resultadoCreacion = await guiaRemisionRepository.crear(guiaRemision);

    if (!resultadoCreacion.success) {
        return {
            codigo: 400,
            respuesta: {
                success: false,
                message: "La guia de remision no se creo correctamente.",
                data: null,
                status: 400
            }
        };
    }

    return {
        codigo: 201,
        respuesta: {
            success: true,
            message: "La guia de remision se creo correctamente.",
            data: null,
            status: 201
        }
    };
}