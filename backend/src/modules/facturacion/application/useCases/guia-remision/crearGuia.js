module.exports = async (body, guiaRemisionRepository) => {

    const { success, message, data: resultadoCreacion } = await guiaRemisionRepository.crear(body);

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