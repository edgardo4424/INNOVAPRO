import api from "@/shared/services/api";

const beneficiosService = {
   getTrabajadoresVacaciones: () => api.get("/vacaciones"),
   getBonos:()=>api.get("/bonos"),
   getAdelantos:()=>api.get('/adelanto_sueldo'),
   crear:(data)=>api.post("/vacaciones/crear",data),
   getTrabajadores:()=>api.get("/trabajadores"),
   crearAdelantoSaldo:(data)=>api.post("/adelanto_sueldo",data),
   editarAdelantoSueldo:(data)=>api.put("/adelanto_sueldo",data),
   eliminarAdelantoSueldo:(id)=>api.delete(`adelanto_sueldo/${id}`)
};

export default beneficiosService;
