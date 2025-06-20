import api from "@/shared/services/api";

const obrasService = {
  obtenerObras: async () => {
    const res = await api.get("/obras");
    return res.data;
  },

  obtenerClientes: async () => {
    const res = await api.get("/clientes");
    return res.data.filter((c) => c.ruc);
  },

  crearObra: async (data) => {
    console.log("📤 Enviando nueva obra al backend:", data);
    const res = await api.post("/obras", data);
    return res.data.obra;
  },

  actualizarObra: async (id, data) => {
    console.log("✏️ Actualizando obra:", data);
    const res = await api.put(`/obras/${id}`, data);
    return res.data;
  },

  eliminarObra: async (id) => {
    await api.delete(`/obras/${id}`);
  },

  obtenerObraPorId: async (id) => {
    const res = await api.get(`/obras/${id}`);
    return res.data;
  },
};

export default obrasService;