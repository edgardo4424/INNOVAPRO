module.exports = async (facturaRepository) => {

    // * Llamamos al repositorio para obtener todas las facturas
    const { succes, message, data: dataFinal } = await facturaRepository.documentosPendiente();
    console.log(dataFinal)

    if (!dataFinal || dataFinal?.length == 0)
        return {
            codigo: 200,
            respuesta: {
                status: 200,
                succes: true,
                message: "No hay documentos pendientes",
                total: 0,
                data: [],
            },
        };

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            message: "Documentos pendientes encontrados",
            total: dataFinal?.length || 0,
            data: dataFinal,
        },
    };
};
