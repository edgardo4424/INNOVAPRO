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
}


export default facturaService