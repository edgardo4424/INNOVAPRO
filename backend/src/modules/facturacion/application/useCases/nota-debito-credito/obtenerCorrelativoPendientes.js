module.exports = async (body, notaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const correlativosFaltantes = await notaRepository.correlativoPendientes(body);

    // ? si no encuenta  ningun correlativo
    if (!correlativosFaltantes || correlativosFaltantes.length === 0)
        return {
            codigo: 200,
            respuesta: {
                status: 200,
                mensaje: "No se encontraron correlativos pendientes",
                estado: false,
                correlativos: null
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

