const Factura = require("../../domain/entities/facura");
module.exports = async (facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const facturas = await facturaRepository.obtenerFacturas();

    // ? si no se encuentra las facturas,
    if (facturas.length == 0)
        return {
            codigo: 200,
            respuesta: {
                mensaje: "Facturas no encontrados",
                estado: true,
                total: 0,
                datos: [],
            },
        };
    // const datosFormateados = Factura.formatearListado(facturas);

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
