import api from "@/shared/services/api";

const trabajadoresService = {
   crear: (data) => api.post("/trabajadores/crear", data),
   crearTrabajador: (data) => api.post("/trabajadores", data),
   editarTrabajador: (data) => api.put("/trabajadores", data),
   obtenerTrabajadorPorId: (id) => api.get(`/trabajadores/${id}`),
   getTrabajadores: () => api.get("/trabajadores"),
};

export default trabajadoresService;
