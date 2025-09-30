import api from "@/shared/services/api";

const vehiculoService = {
    listar: async () => {
        const res = await api.get("/transporte/vehiculo");
        return res.data
    },
};

export default vehiculoService;