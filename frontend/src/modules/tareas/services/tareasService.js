import api from "@/shared/services/api";

const tareasService = {
  obtenerFiliales: async () => {
    const res = await api.get("/filiales");
    return res.data || [];
  },

  obtenerClientes: async () => {
    const res = await api.get("/clientes");
    return res.data || [];
  },

  obtenerObras: async () => {
    const res = await api.get("/obras");
    return res.data || [];
  },

  crearTarea: async (data, token) => {
    const res = await api.post("/tareas", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default tareasService;