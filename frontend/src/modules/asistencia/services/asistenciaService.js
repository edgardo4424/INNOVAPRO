import api from "@/shared/services/api";

const asistenciaService = {
   obtenerTrabajadoresPorFilial: (id, fecha) =>
      api.get(`/trabajadores/filial/${id}/${fecha}`),
   crearAsistenia: (data) => api.post("/asistencias", data),
   actualizarAsistencia: (data) => api.put("/asistencias", data),
};

export default asistenciaService;
