module.exports = async (choferRepository) => {

    const { success, message, data, total } = await choferRepository.listar();

    if (!success) {
        return {
            codigo: 400,
            respuesta: {
                success: success,
                message: message,
                total: total || 0,
                data: null,
            },
        };
    }
    return {
        codigo: 200,
        respuesta: {
            success: success,
            message: message,
            total: total,
            data: data,
        },
    };
};