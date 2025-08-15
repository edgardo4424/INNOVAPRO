// use case: obtenerBorradores.js
module.exports = async (borradorRepository, query) => {
    try {
        const resp = await borradorRepository.listarBorradores(query);

        // Si el repository ya maneja errores, resp.success indicará el estado
        if (!resp || resp.success === false) {
            return {
                codigo: 500,
                respuesta: {
                    mensaje: resp?.message || "Error al listar los borradores.",
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
                mensaje: isEmpty ? "Borradores no encontrados" : "Borradores encontrados",
                estado: true,
                total: totalRecords,
                datos: data,
                meta: {
                    page: Number(meta.currentPage) || Number(query?.page) || 1,
                    totalPages: Number(meta.totalPages) || 1,
                    pageSize: Number(query?.limit) || data.length,
                    // opcional: devolver filtros aplicados para depuración/UX
                    filtros: {
                        tipo_doc: query?.tipo_doc,
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
    } catch (e) {
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
