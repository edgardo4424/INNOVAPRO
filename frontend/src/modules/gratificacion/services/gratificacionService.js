import api from "@/shared/services/api";

const gratificacionService = {
    obtenerGratificaciones: async (perido) => {
        const res = await api.post("/gratificaciones/calcular",perido);
        return res.data;
    },
};

export default gratificacionService;