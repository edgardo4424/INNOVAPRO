import api from "@/shared/services/api";

const beneficiosService = {
   getDataMantenimiento: () => api.get("/data_mantenimiento"),
   getDataMantenimientoPorId: (id) => api.get(`/data_mantenimiento/${id}`),
   editDataMantenimiento: (id, data) => api.put(`/data_mantenimiento/${id}`, data),
};

export default beneficiosService;
