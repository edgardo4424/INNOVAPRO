module.exports = async (chofer, choferRepository) => {

    const {success, message, data} = await choferRepository.actualizar(chofer);
    
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