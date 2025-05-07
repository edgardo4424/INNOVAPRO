import api from "@/shared/services/api";

const empresasService = {
  async obtenerEmpresas() {
    const res = await api.get("/filiales");
    return res.data;
  },

  async crearEmpresa(data) {
    const res = await api.post("/filiales", data);
    return res.data.empresa || res.data;
  },

  async actualizarEmpresa(id, data) {
    const res = await api.put(`/filiales/${id}`, data);
    return res.data;
  },

  async eliminarEmpresa(id) {
    await api.delete(`/filiales/${id}`);
  },
};

export default empresasService;