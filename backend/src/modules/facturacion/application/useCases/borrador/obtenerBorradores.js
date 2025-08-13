module.exports = async (borradorRepository, query) => {
    const {
        page,
        limit,
        tipo_borrador,
        empresa_ruc,
        cliente_num_doc,
        cliente_razon_social,
        usuario_id,
        fec_des,
        fec_ast,
    } = query;
    // * Llamamos al repositorio para obtener todas las facturas
    const borradores = await borradorRepository.listarBorradores(
        page,
        limit,
        tipo_borrador,
        empresa_ruc,
        cliente_num_doc,
        cliente_razon_social,
        usuario_id,
        fec_des,
        fec_ast
    );

    // ? si no se encuentra las facturas,
    if (borradores.length == 0)
        return {
            codigo: 200,
            respuesta: {
                mensaje: "Borradores no encontrados",
                estado: true,
                total: 0,
                datos: [],
            },
        };
    // const datosFormateados = Factura.formatearListado(facturas);

    return {
        codigo: 200,
        respuesta: {
            mensaje: "Borradores encontrados",
            estado: true,
            total: borradores.length,
            borradores: borradores,
            // facturas: datosFormateados,
        },
    };
};
