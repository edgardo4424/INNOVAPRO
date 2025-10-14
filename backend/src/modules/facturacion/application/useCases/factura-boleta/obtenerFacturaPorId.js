module.exports = async (id, facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const facturaObtenida = await facturaRepository.obtenerFactura(id);

    // ? si no se encuentra la factura
    if (!facturaObtenida)
        return {
            codigo: 200,
            respuesta: {
                mensaje: "Factura no encontrada",
                estado: false,
                factura: null
            },
        };


    return {
        codigo: 200,
        respuesta: {
            mensaje: "Se encontro la factura correctamente",
            estado: true,
            factura: facturaObtenida,
        },
    };
};
