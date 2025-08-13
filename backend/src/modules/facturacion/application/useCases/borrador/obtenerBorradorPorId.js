module.exports = async (id, borradorRepository) => {
    const { success, message, data: result } = await borradorRepository.obtenerBorradorPorId(id);

    if (!success) {
        return {
            codigo: 500,
            respuesta: {
                success: false,
                message: message,
                data: null,
            }
        };
    }
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: message,
            data: result,
        }
    };
}
