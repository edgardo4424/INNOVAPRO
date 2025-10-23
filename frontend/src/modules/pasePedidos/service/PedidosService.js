import api from "@/shared/services/api";


const pedidosService = {
    obtenerPasePedidos: async (query) => {
        const res = await api.get(`/pases_pedidos`);
        return res.data;
    },
    verificarStockPedido: async (body) => {
        const res = await api.post(`/stock/verificar-stock`, body);
        return res.data;
    },
    nuevaTareaPasePedido: async (body) => {
        const res = await api.post(`/tareas`, body);
        return res.data;
    }
}

export default pedidosService;