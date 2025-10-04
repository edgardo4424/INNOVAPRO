import api from "@/shared/services/api";

const facturaService = {
    // * ENDPOINTS FACTURAS
    obtenerTodasLasFacturas: async (query) => {
        const res = await api.get(`/facturacion/facturas${query}`);
        return res.data;
    },
    obtenerFacturaDetallada: async (body) => {
        const res = await api.post(`/facturacion/factura/detallada`, body);
        return res.data;
    },
    registrarFactura: async (factura) => {
        const res = await api.post(`/facturacion/registrar`, factura);
        return res.data;
    },
    obtenerDocumentoConId: async (documento_id) => {
        const res = await api.get(`/facturacion/factura/${documento_id}`);
        return res.data;
    },
    obtenerCorrelativo: async (body) => {
        const res = await api.post(`/facturacion/correlativo`, body);
        return res.data;
    },
    obtenerCdrZip: async (body) => {
        const res = await api.post(`/facturacion/cdr-zip`, body);
        return res.data;
    },
    obtenerDocumentosParaNotas: async (body) => {
        const res = await api.post(`/facturacion/documentos`, body);
        return res.data;
    },
    anularFactura: async (body) => {
        const res = await api.post(`/facturacion/factura/anular`, body);
        return res.data;
    },

    // * ENDPOINTS BORRADORES
    registrarBorrador: async (borrador) => {
        const res = await api.post(`/facturacion/borrador/crear`, borrador);
        return res.data;
    },
    obtenerTodosLosBorradores: async (query) => {
        const res = await api.get(`/facturacion/borradores${query}`);
        return res.data;
    },
    obtenerBorradorConId: async (borrador_id) => {
        const res = await api.get(`/facturacion/borrador?id=${borrador_id}`);
        return res.data;
    },
    eliminarBorrador: async (borrador_id) => {
        const res = await api.patch(`/facturacion/borrador/eliminar/${borrador_id}`);
        return res.data;
    },

    // * ENDPOINTS GUIA REMISION

    registrarGuiaRemision: async (guia) => {
        const res = await api.post(`/facturacion/guia-remision/crear`, guia);
        return res.data;
    },
    obtenerCorrelativoGuia: async (body) => {
        const res = await api.post('/facturacion/guia-remision/correlativo', body);
        return res.data
    },
    obtenerTodasLasGuiasRemision: async (query) => {
        const res = await api.get(`/facturacion/guia-remision${query}`);
        return res.data;
    },
    obtenerGuiaDetallada: async (body) => {
        const res = await api.post(`/facturacion/guia-remision/detallada`, body);
        return res.data;
    },
    obtenerGuiasARelacionar: async (query) => {
        const res = await api.get(`/facturacion/guia-remision/relaciones${query}`);
        return res.data;
    },
    obtenerMtc: async (ruc) => {
        const res = await api.get(`/facturacion/mtc?ruc=${ruc}`);
        return res.data
    },
    obtenerDocumentosARelacionar: async (body) => {
        const res = await api.post(`/facturacion/guia-remision/relaciones`, body);
        return res.data;
    },
    obtenerUbigeoDireccion: async (body) => {
        const rest = await api.post(`/localizacion/ubigeo`, body);
        return rest.data
    },


    // * ENDPOINTS NOTA DE CREDITO O DEBITO
    registrarNota: async (nota) => {
        const res = await api.post(`/facturacion/nota-debito-credito/crear`, nota);
        return res.data;
    },
    obtenerCorrelativoNota: async (body) => {
        const res = await api.post('/facturacion/nota-debito-credito/correlativo', body);
        return res.data
    },
    obtenerTodasLasNotas: async (query) => {
        const res = await api.get(`/facturacion/nota-debito-credito${query}`);
        return res.data;
    },
    obtenerNotaDetallada: async (body) => {
        const res = await api.post(`/facturacion/nota-debito-credito/detallada`, body);
        return res.data;
    },


    // ? ENDPOINTS REPORTES
    reporteVentas: async (body) => {
        const res = await api.post(`/facturacion/reporte-venta`, body);
        return res.data;
    },
    reporteFactura: async (body) => {
        const res = await api.post(`/reports/reporte-factura`, body, {
            responseType: 'blob',
        });
        return res.data;
    },
    reporteGuia: async (body) => {
        const res = await api.post(`/reports/reporte-guia`, body, {
            responseType: 'blob',
        });
        return res.data;
    },
    reporteNota: async (body) => {
        const res = await api.post(`/reports/reporte-nota`, body, {
            responseType: 'blob',
        });
        return res.data;
    },
}


export default facturaService