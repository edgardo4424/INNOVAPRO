import api from "@/shared/services/api";

const planillaQuincenalService = {
    obtenerPlanillaQuincenal: async (dataPOST) => {
        const res = await api.post("/planilla/planilla-quincenal-calcular",dataPOST);
        return res.data;
    },
    obtenerFiliales: async () => {
        const res = await api.get("/filiales");
        return res.data;
    },
    obtenerPlanillaQuincenalCerradas: async (dataPOST) => {
        const res = await api.post("/planilla/quincenal",dataPOST);
        return res.data;
    },
    cerrarPlanillaQuincenal: async (dataPOST) => {
        const res = await api.post("/planilla/planilla-quincenal-cierre",dataPOST);
        return res.data;
    },
};

export default planillaQuincenalService;