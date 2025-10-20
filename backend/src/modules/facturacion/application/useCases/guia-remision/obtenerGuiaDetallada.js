module.exports = async (body, guiaRepository) => {

    const { correlativo, serie, empresa_ruc, tipo_doc, id } = body;
    // * Llamamos al repositorio para obtener todas las facturas
    const guiaObtenida = await guiaRepository.obtenerGuiaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc, id);

    // ? si no se encuentra la Guia
    if (!guiaObtenida)
        return {
            codigo: 200,
            respuesta: {
                status: 400,
                succes: false,
                message: "Guia no encontrada",
                data: null,
            },
        };

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            message: "Se encontro la Guia correctamente",
            data: guiaObtenida,
        },
    };
};
