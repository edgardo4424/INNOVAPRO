module.exports = async (body, facturaRepository) => {

    const { fecha_reporte } = body;
    let dashboarContent = {
        count: null,
        cash: null
    }

    // * Total emitido en factura
    const { succes: succesFactura, data: dataCount } = await facturaRepository.emitidosFilialUnificado();

    // ? si no se encuentra la factura
    if (!succesFactura) {
        dashboarContent.count = dataCount
    };

    // * Total emitido en factura
    const { succes: succesCash, data: dataCash } = await facturaRepository.emitidosMontosPorFilialRangos(fecha_reporte);

    console.log(dataCash)

    // ? si no se encuentra la factura
    if (!succesCash) {
        dashboarContent.cash = dataCash
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

