import api from "@/shared/services/api";

const beneficiosService = {
   getTrabajadoresVacaciones: () => api.get("/vacaciones"),
   crear:(data)=>api.post("/vacaciones/crear",data)
};

export default beneficiosService;
