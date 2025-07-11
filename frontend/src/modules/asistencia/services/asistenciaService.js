import api from "@/shared/services/api";

const asistenciaService = {
   obtenerTrabajadoresPorFilial: (id) => api.get(`/trabajadores/filial/${id}`),
};

export default asistenciaService;
