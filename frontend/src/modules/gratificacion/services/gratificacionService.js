import api from "@/shared/services/api";

const gratificacionService = {
    obtenerGratificaciones: async (data) => {
        const res = await api.post("/gratificaciones/calcular",data);
        return res.data;
    },
    cerrarGratificaciones: async (data) => {
        console.log('data', data);
        const res = await api.post("/gratificaciones/cierre",data);
        return res.data;
    },
    obtenerGratificacionesCerradas: async (data) => {
        const res = await api.post("/gratificaciones",data);
        return res.data;
    },
    obtenerFiliales: async () => {
        const res = await api.get("/filiales");
        return res.data;
    },
};

export default gratificacionService;