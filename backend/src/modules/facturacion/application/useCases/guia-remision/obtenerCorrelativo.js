module.exports = async (guiaRemisionRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const {correlativo_guia} = await guiaRemisionRepository.correlativo();

    // ? si no encuenta  ningun correlativo
    if (!correlativo_guia)
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
            correlativos: correlativo_guia,
        },
    };
};
