module.exports = async (facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const ultimosCorrelativos = await facturaRepository.correlativo();


    console.log("PRIMER CLG", ultimosCorrelativos)
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

        // const  facturaDataValues = {...facturaObtenida.dataValues, factura_detalles: facturaObtenida.factura_detalles.dataValues, formas_pago: facturaObtenida.formas_pago.dataValues, leyendas: facturaObtenida.leyendas.dataValues};
        console.log("SEGUNDO CLG",ultimosCorrelativos);
    // const datosFormateados = Factura.formatearFactura([facturaObtenida]);

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Se encontro correctamente los correlativo",
            estado: true,
            correlativos: ultimosCorrelativos,
        },
    };
};
