import api from "./api";

const productosServiciosService = {
  obtenerTodos: (empresaId = null) => {
    const url = empresaId ? `/productos-servicios?empresa_id=${empresaId}` : "/productos-servicios";
    return api.get(url);
  },

  obtenerPorId: (id) => api.get(`/productos-servicios/${id}`),

  crear: (data) => api.post("/productos-servicios", data),

  actualizar: (id, data) => api.put(`/productos-servicios/${id}`, data),

  eliminar: (id) => api.delete(`/productos-servicios/${id}`),
};

export default productosServiciosService;