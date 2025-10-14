import api from "@/shared/services/api";

const trabajadoresService = {
   crear: (data) => api.post("/trabajadores/crear", data),
   crearTrabajador: (data) => api.post("/trabajadores", data),
   editarTrabajador: (data) => api.put("/trabajadores", data),
   obtenerTrabajadorPorId: (id) => api.get(`/trabajadores/${id}`),
   getTrabajadores: () => api.get("/trabajadores"),
   dataMantenimiento:()=>api.get("/data_mantenimiento/codigo/valor_uit"),
   getFiliales:()=>api.get("/filiales"),
   getFilialesVigentes:(dni, anio, mes) =>
      api.get(`/trabajadores/${dni}/filiales-vigentes`, { params: {anio, mes } }),

};

export default trabajadoresService;
