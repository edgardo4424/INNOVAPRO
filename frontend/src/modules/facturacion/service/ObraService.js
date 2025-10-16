import api from "@/shared/services/api";


const obraService = {
    obtenerObras: async () => {
        const res = await api.get("/obras");
        return res.data;
    },
}

export default obraService