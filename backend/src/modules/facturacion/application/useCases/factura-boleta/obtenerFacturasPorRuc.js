module.exports = async (body, facturaRepository) => {
    try {
        const facturas = await facturaRepository.documentosPorRuc(body);

        if (!facturas || facturas.length === 0) {
            return {
                codigo: 400,
                respuesta: {
                    message: "no se encontraron facturas",
                    status: false,
                    count: 0,
                    data: [],
                },
            };
        }

        return {
            codigo: 200,
            respuesta: {
                message: "se encontraron facturas",
                status: true,
                count: facturas.length,
                data: facturas,
            },
        };
    } catch (e) {
        return {
            codigo: 500,
            respuesta: {
                message: "Error al obtener las facturas relacionadas.",
                status: false,
                count: 0,
                data: null,
            },
        };
    }
};
