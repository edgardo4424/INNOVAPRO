import api from "@/shared/services/api";

const choferService = {
    listar: async () => {
        const res = await api.get("/transporte/chofer");
        return res.data
    },
    crear: async (data) => {
        const res = await api.post(`/transporte/chofer`, data);
        return res.data
    },
    actualizar: async (data) => {
        const res = await api.put(`/transporte/chofer`, data);
        return res.data
    },
    eliminar: async (id) => {
        const res = await api.delete(`/transporte/chofer`, {
            data: { id },
        });
        return res.data;
    },
};

export default choferService;