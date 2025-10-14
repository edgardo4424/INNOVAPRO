module.exports = async (body, facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const correlativosFaltantes = await facturaRepository.correlativoPendientes(body);
    // ? si no encuenta  ningun correlativo
    if (!correlativosFaltantes || correlativosFaltantes.length === 0)
        return {
            codigo: 200,
            respuesta: {
                status: 200,
                mensaje: "No se encontraron correlativos pendientes",
                estado: false,
                data: []
            },
        };


    return {
        codigo: 200,
        respuesta: {
            status: 200,
            message: "Se encontro correctamente los correlativo",
            succes: true,
            data: correlativosFaltantes,
        },
    };
};

