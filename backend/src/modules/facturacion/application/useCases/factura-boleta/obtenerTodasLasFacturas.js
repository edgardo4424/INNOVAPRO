module.exports = async (facturaRepository, query) => {
    const { tipo, page, limit, num_doc, tip_doc, fec_des, fec_ast } = query;
    // * Llamamos al repositorio para obtener todas las facturas
    const facturas = await facturaRepository.obtenerFacturas(tipo, page, limit, num_doc, tip_doc, fec_des, fec_ast);
    // console.log("Facturas Obtendidas:", facturas);

    // ? si no se encuentra las facturas,
    if (facturas.length == 0)
        return {
            codigo: 200,
            respuesta: {
                mensaje: "Facturas no encontrados",
                estado: true,
                total: 0,
                facturas: [],
            },
        };
    // const datosFormateados = Factura.formatearListado(facturas);

    console.table(facturas);
    return {
        codigo: 200,
        respuesta: {
            mensaje: "Facturas encontrados",
            estado: true,
            total: facturas.length,
            facturas: facturas,
            // facturas: datosFormateados,
        },
    };
};
