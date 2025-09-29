module.exports = async (chofer, choferRepository) => {
    const { id } = chofer;

    const { success, message, data } = await choferRepository.eliminar(id);

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