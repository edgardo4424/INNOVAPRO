module.exports = async (body, facturaRepository) => {

    const { fecha_reporte, start_date, end_date, serie } = body;
    let dashboarContent = {
        count: null,
        cash: null,
        total: null
    }

    // * Total emitido en factura
    const { succes: succesFactura, data: dataCount } = await facturaRepository.emitidosFilialUnificado();

    // ? si no se encuentra la factura
    if (!succesFactura) {
        // dashboarContent.count = dataCount
    };

    // * Total emitido en factura
    const { succes: succesCash, data: dataCash } = await facturaRepository.emitidosMontosPorFilialRangos(fecha_reporte);


    // ? si no se encuentra la factura
    if (!succesCash) {
        // dashboarContent.cash = dataCash
    };

    // const { succes: succesFacturado, data: dataFacturado } = await facturaRepository.totalFacturado(start_date, end_date, serie);

    console.log(dataFacturado)

    if (!succesCash) {
        dashboarContent.total = dataFacturado
    };

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            mensaje: "Renderizado dasboard",
            data: dashboarContent
        },
    };
};

