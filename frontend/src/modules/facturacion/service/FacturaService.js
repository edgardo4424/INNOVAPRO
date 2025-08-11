import api from "@/shared/services/api";

const facturaService = {
    // * ENDPOINTS FACTURAS
    obtenerTodasLasFacturas: async (query) => {
        const res = await api.get(`/facturacion/facturas${query}`);
        return res.data;
    },
    registrarFactura: async (factura) => {
        const res = await api.post(`/facturacion/registrar`, factura);
        return res.data;
    },
    obtenerDocumentoConId: async(documento_id) =>{
        const res = await api.get(`/facturacion/factura/${documento_id}`);
        return res.data;
    },
    obtenerCorrelativo: async () => {
        const res = await api.get(`/facturacion/correlativo`);
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
    eliminarBorrador: async (id) => {
        const res = await api.patch(`/facturacion//eliminar-borrador/${id}`);
        return res.data;
    }
}


export default facturaService