import api from "@/shared/services/api";

const planillaMensualService = {
    obtenerPlanillaMensual: async (dataPOST) => {
        const res = await api.post("/planilla/planilla-mensual-calcular",dataPOST);
        return res.data;
    },
    obtenerFiliales: async () => {
        const res = await api.get("/filiales");
        return res.data;
    },
};

export default planillaMensualService;