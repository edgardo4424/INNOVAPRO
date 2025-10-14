module.exports = async (body, facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const resultado = await facturaRepository.verificarCorrelativoRegistrado(body);

    // ? si se encuentra el correlativo
    if (resultado)
        return {
            codigo: 400,
            respuesta: {
                status: 400,
                mensaje: "el correlativo esta registrado",
                estado: false,
                facturar: false
            },
        };


    return {
        codigo: 200,
        respuesta: {
            status: 200,
            mensaje: "el correlativo no esta registrado",
            estado: true,
            facturar: true
        },
    };
};
