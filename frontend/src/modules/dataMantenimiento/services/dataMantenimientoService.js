import api from "@/shared/services/api";

const dataMantenimientoService = {
   getDataMantenimiento: () => api.get("/data_mantenimiento"),
   getDataMantenimientoPorId: (id) => api.get(`/data_mantenimiento/${id}`),
   editDataMantenimiento: (id, data) => api.put(`/data_mantenimiento/${id}`, data),
};

export default dataMantenimientoService;
