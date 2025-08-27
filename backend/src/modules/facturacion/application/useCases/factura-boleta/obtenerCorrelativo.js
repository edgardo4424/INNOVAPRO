module.exports = async (facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const ultimosCorrelativos = await facturaRepository.correlativo();

    // ? si no encuenta  ningun correlativo
    if (!ultimosCorrelativos)
        return {
            codigo: 200,
            respuesta: {
                mensaje: "Ocurrio un error al buscar el correlativo",
                estado: false,
                correlativos: null
            },
        };


    return {
        codigo: 200,
        respuesta: {
            mensaje: "Se encontro correctamente los correlativo",
            estado: true,
            correlativos: ultimosCorrelativos,
        },
    };
};
