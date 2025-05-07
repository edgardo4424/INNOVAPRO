import api from "@/shared/services/api";

const usuariosService = {
  obtenerUsuarios: async () => {
    const res = await api.get("/usuarios");
    return res.data.usuarios || [];
  },

  crearUsuario: async (data) => {
    console.log("📤 Enviando nuevo usuario:", data);
    const res = await api.post("/usuarios", data);
    return res.data.usuario;
  },

  actualizarUsuario: async (id, data) => {
    console.log("✏️ Actualizando usuario:", data);
    const res = await api.put(`/usuarios/${id}`, data);
    return res.data.usuario;
  },

  eliminarUsuario: async (id) => {
    await api.delete(`/usuarios/${id}`);
  },

  obtenerUsuarioPorId: async (id) => {
    const res = await api.get(`/usuarios/${id}`);
    return res.data.usuario;
  },
};

export default usuariosService;