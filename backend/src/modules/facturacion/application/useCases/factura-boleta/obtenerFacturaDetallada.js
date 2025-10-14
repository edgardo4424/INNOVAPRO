module.exports = async (body, facturaRepository) => {

    const { correlativo, serie, empresa_ruc, tipo_doc } = body;
    // * Llamamos al repositorio para obtener todas las facturas
    const facturaObtenida = await facturaRepository.obtenerFacturaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc);

    // ? si no se encuentra la factura
    if (!facturaObtenida)
        return {
            codigo: 200,
            respuesta: {
                status: 400,
                succes: false,
                message: "Factura no encontrada",
                data: null,
            },
        };

        console.log(facturaObtenida)

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            message: "Se encontro la factura correctamente",
            data: facturaObtenida,
        },
    };
};
