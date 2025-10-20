import api from "@/shared/services/api";

const ctsService = {
    obtenerCts: (data) =>api.post("/cts/cts-individual",data),
    obtenerCtsGeneral: (data) =>api.post("/cts/calcular",data),
    generarCts: (data) =>api.post("/cts/generar-cierre-cts",data),
    obtenerTrabajadores:()=>api.get("/trabajadores/trabajadores-contratos"),
    obtenerHistorico:(data)=>api.post("/cts/historico",data)
};

export default ctsService;