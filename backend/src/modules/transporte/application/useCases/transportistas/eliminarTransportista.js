module.exports = async (transporte, transportistaRepository) => {
    const { id } = transporte;

    const { success, message, data } = await transportistaRepository.eliminar(id);

    if(!success) {
        return {
            codigo: 400,
            respuesta: {
                success: success,
                message: message,
                data: null,
            },
        };
    }
    return {
        codigo: 200,
        respuesta: {
            success: success,
            message: message,
            data: data,
        },
    };

};