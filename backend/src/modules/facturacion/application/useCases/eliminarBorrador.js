module.exports = async (id, facturaRepository) => {
    const facturasEliminada = await facturaRepository.eliminar(id);

    if (!facturasEliminada) {
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
            data: facturasEliminada,
        }
    };
}
