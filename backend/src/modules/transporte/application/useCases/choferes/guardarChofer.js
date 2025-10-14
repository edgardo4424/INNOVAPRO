module.exports = async (chofer, choferRepository) => {
    let result;

    // ? Si viene con ID -> actualizar, si no -> crear
    if (chofer.id != null && chofer.id != undefined) {
        result = await choferRepository.actualizar(chofer);
    } else {
        result = await choferRepository.crear(chofer);
    }

    const { success, message, data } = result;

    if (!success) {
        return {
            codigo: 400,
            respuesta: {
                success,
                message,
                data: null,
            },
        };
    }

    return {
        codigo: 200,
        respuesta: {
            success,
            message,
            data,
        },
    };
};
