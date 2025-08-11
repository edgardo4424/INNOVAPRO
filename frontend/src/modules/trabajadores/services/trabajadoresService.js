import api from "@/shared/services/api";

const trabajadoresService = {
   crear: (data) => api.post("/trabajadores/crear", data),
   crearTrabajador: (data) => api.post("/trabajadores", data),
   getTrabajadores: () => api.get("/trabajadores"),
};

export default trabajadoresService;
