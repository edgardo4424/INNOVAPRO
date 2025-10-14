module.exports = async (body, notaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const ultimosCorrelativos = await notaRepository.correlativo(body);

    // ? si no encuenta  ningun correlativo
    if (!ultimosCorrelativos)
        return {
            codigo: 200,
            respuesta: {
                status: 400,
                mensaje: "Ocurrio un error al buscar el correlativo",
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
            data: ultimosCorrelativos,
        },
    };
};
