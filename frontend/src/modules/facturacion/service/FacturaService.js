import api from "@/shared/services/api";

const facturaService = {
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
    }
}


export default facturaService