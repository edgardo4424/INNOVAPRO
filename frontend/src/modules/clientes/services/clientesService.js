import api from "../../../services/api";

const clientesService = {
  obtenerTodos: () => api.get("/clientes"),

  obtenerPorId: (id) => api.get(`/clientes/${id}`),

  crear: (data) => api.post("/clientes", data),

  actualizar: (id, data) => api.put(`/clientes/${id}`, data),

  eliminar: (id) => api.delete(`/clientes/${id}`),
};

export default clientesService;