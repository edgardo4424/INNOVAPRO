module.exports = async (query, facturaRepository) => {
    try {
        const resp = await facturaRepository.reporte(query);

        if (!resp || resp.success === false) {
            return {
                codigo: 500,
                respuesta: {
                    mensaje: resp?.message || "Error al listar los documentos.",
                    estado: false,
                    error: resp?.error || null,
                },
            };
        }

        const data = Array.isArray(resp.data) ? resp.data : [];
        const meta = resp.metadata || {};
        const totalRecords = Number.isFinite(meta.totalRecords) ? meta.totalRecords : data.length;
        const isEmpty = data.length === 0;

        return {
            codigo: 200,
            respuesta: {
                mensaje: isEmpty ? "Documentos no encontrados" : "Documentos encontrados",
                estado: true,
                total_facturas_boleta: meta.total_facturas_boleta,
                total_guia: meta.total_guia,
                total_notas: meta.total_notas,
                total: totalRecords,
                datos: data,
                meta: {
                    // opcional: devolver filtros aplicados para depuración/UX
                    filtros: {
                        factura: query?.ac_factura,
                        boleta: query?.ac_boleta,
                        nota_credito: query?.ac_n_credito,
                        nota_debito: query?.ac_n_debito,
                        guia: query?.ac_guia,
                        empresa_ruc: query?.empresa_ruc,
                        cliente_num_doc: query?.cliente_num_doc,
                        cliente_razon_social: query?.cliente_razon_social,
                        usuario_id: query?.usuario_id,
                        fec_des: query?.fec_des,
                        fec_ast: query?.fec_ast,
                    },
                },
            },
        };
    } catch (error) {
        return {
            codigo: 500,
            respuesta: {
                mensaje: "Error inesperado al obtener borradores.",
                estado: false,
                error: e.message,
            },
        };
    }
};


({
    "ac_factura": true,
    "ac_boleta": false,
    "ac_n_credito": false,
    "ac_n_debito": false,
    "ac_guia": true,
    "empresa_ruc": "20123456789",
    "cliente_num_doc": "10456789012",
    "cliente_razon_social": "COMERCIAL ABC S.A.C.",
    "usuario_id": 5,
    "fec_des": "2025-09-01",
    "fec_ast": "2025-09-30"
}
)