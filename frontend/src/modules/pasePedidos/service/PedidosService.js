import api from "@/shared/services/api";


const pedidosService = {
    obtenerPasePedidos: async (query) => {
        const res = await api.get(`/pases_pedidos`);
        return res.data;
    },
    obtenerPasesPedidosTv: async (date) => {
        const res = await api.get(`/pases_pedidos/tv/${date}`);
        return res.data;
    },
    verificarStockPedido: async (body) => {
        const res = await api.post(`/stock/verificar-stock`, body);
        return res.data;
    },
    nuevaTareaPasePedido: async (body) => {
        const res = await api.post(`/tareas/crear-tarea-pase`, body);
        return res.data;
    }
}

export default pedidosService;