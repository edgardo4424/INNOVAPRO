import api from "@/shared/services/api";

const asistenciaService = {
   obtenerTrabajadoresPorFilial: (id, fecha) =>
      api.get(`/trabajadores/filial/${id}/${fecha}`),
   crearAsistenia: (data) => api.post("/asistencias", data),
   actualizarAsistencia: (data) => api.put("/asistencias", data),
   crearAsistenciaSimple: (data) => api.post("/asistencias/simple", data),
   actualizarAsistenciaSimple: (data) => api.put("/asistencias/simple", data),
   obtenerTrabajadoresPorArea: (fecha) =>api.get(`/trabajadores/area/${fecha}`),
   getAreas:()=>api.get("/trabajadores/areas"),

};

export default asistenciaService;
