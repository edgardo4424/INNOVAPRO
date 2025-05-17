import api from "@/shared/services/api";

const contactosService = {
  obtenerContactos: async () => {
    const res = await api.get("/contactos");
    return res.data;
  },

  obtenerClientes: async () => {
    const res = await api.get("/clientes");
    return res.data.filter((clientes) => clientes.ruc); // solo clientes con RUC
  },

  obtenerObras: async () => {
    const res = await api.get("/obras");
    return res.data;
  },

  crearContacto: async (data) => {
    console.log("📤 Enviando nuevo contacto al backend:", data);
    const res = await api.post("/contactos", data);
    return res.data.contacto;
  },

  actualizarContacto: async (id, data) => {
    console.log("✏️ Enviando contacto actualizado:", data);
    const res = await api.put(`/contactos/${id}`, data);
    return res.data;
  },

  eliminarContacto: async (id) => {
    await api.delete(`/contactos/${id}`);
  },

  obtenerContactoPorId: async (id) => {
    const res = await api.get(`/contactos/${id}`);
    return res.data;
  }
};

export default contactosService;