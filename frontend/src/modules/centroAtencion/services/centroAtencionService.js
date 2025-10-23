import api from "@/shared/services/api";


const centroAtencionService = {
  crearDespieceOT: async (payload) => {
    const res = await api.post("/tareas/crear-despiece-ot", payload);
    return res.data;
  },
  listarTareas: async () => {
    const res = await api.get("/tareas");
    return res.data;
  },
};

export default centroAtencionService;