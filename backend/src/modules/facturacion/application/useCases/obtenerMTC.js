module.exports = async () => {
    const correlativos = await facturaRepository.correlativo();

    if (!correlativos) {
        return {
            codigo: 500,
            respuesta: {
                mensaje: "Ocurrio un error al buscar el correlativo",
                estado: false,
                correlativos: null,
            },
        };
    }

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Se encontro correctamente los correlativo",
            estado: true,
            correlativos: correlativos,
        },
    };
};
