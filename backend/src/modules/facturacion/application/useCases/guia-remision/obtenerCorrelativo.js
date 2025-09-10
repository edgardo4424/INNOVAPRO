module.exports = async (body,guiaRemisionRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const correlativo_guia = await guiaRemisionRepository.correlativo(body);

    // ? si no encuenta  ningun correlativo
    if (!correlativo_guia)
        return {
            codigo: 200,
            respuesta: {
                status: 400,
                message: "Ocurrio un error al buscar el correlativo",
                succes: false,
                data: null
            },
        };


    return {
        codigo: 200,
        respuesta: {
            status: 200,
            message: "Se encontro correctamente los correlativo",
            succes: true,
            data: correlativo_guia,
        },
    };
};
