module.exports = async (facturaRepository) => {
    // * Llamamos al repositorio para obtener todas las facturas
    const facturas = await facturaRepository.obtenerTodasLasFacturas();

    // ? si no se encuentra el usuario,
    if (facturas.length == 0)
        return {
            codigo: 204,
            respuesta: {
                mensaje: "Facturas no encontrados",
                estado: true,
                datos: [],
            },
        };

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Facturas encontrados",
            estado: true,
            total: facturas.length,
            datos: facturas,
        },
    };
};
