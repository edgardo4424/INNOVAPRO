import api from "@/shared/services/api";

const transportistaService = {
    listar: async () => {
        const res = await api.get("/transporte/transportista");
        return res.data
    },
    guardar: async (data) => {
        const res = await api.post(`/transporte/transportista`, data);
        return res.data
    },
    eliminar: async (id) => {
        const res = await api.delete(`/transporte/transportista`, {
            data: { id },
        });
        return res.data;
    },
};

export default transportistaService;