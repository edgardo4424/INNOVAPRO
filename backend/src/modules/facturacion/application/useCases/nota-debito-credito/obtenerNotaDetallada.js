module.exports = async (body, notaRepository) => {

    const { correlativo, serie, empresa_ruc, tipo_doc } = body;
    // * Llamamos al repositorio para obtener todas las facturas
    const notaObtenida = await notaRepository.obtenerNotaDetallada(correlativo, serie, empresa_ruc, tipo_doc);

    // ? si no se encuentra la factura
    if (!notaObtenida)
        return {
            codigo: 200,
            respuesta: {
                status: 400,
                succes: false,
                message: "Nota no encontrada",
                data: null,
            },
        };

    console.log(notaObtenida)

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            message: "Se encontro la nota correctamente",
            data: notaObtenida,
        },
    };
};
