import api from "@/shared/services/api";

const facturaService = {
    obtenerTodasLasFacturas: async () => {
        const res = await api.get(`/facturacion`);
        return res.data;
    },
    registrarFactura: async (factura) => {
        const res = await api.post(`/facturacion/registrar`, factura);
        return res.data;
    },
}


export default facturaService