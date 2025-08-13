import api from "@/shared/services/api";

const beneficiosService = {
   getTrabajadoresVacaciones: () => api.get("/vacaciones"),
   getBonos:()=>api.get("/bonos"),
   crear:(data)=>api.post("/vacaciones/crear",data)
};

export default beneficiosService;
