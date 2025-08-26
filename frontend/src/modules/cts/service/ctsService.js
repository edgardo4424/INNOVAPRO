import api from "@/shared/services/api";

const ctsService = {
    obtenerCts: (data) =>api.post("/cts/cts-individual",data),
    obtenerTrabajadores:()=>api.get("/trabajadores")
};

export default ctsService;