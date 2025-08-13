module.exports = async (id, borradorRepository) => {
    const result = await borradorRepository.eliminar(id);

    if (!result.success) {
        return {
            codigo: 500,
            respuesta: {
                success: false,
                message: "El borrador no se elimino correctamente.",
                data: null,
            }
        };
    }
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: "El borrador se elimino correctamente.",
            data: null,
        }
    };
}
