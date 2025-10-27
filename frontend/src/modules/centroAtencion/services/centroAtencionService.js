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
  corregirTarea: async (id, payload) => {
    const res = await api.put(`/tareas/${id}/corregir`, payload);
    return res.data;
  },
  devolverTarea: async (id, payload) => {
    const res = await api.put(`/tareas/${id}/devolver`, payload);
    return res.data;
  },
  listarPiezas: async () => {
    const res = await api.get("/piezas");
    return res.data;
  },
  obtenerCotizacion: async (id) => {
    const res = await api.get(`/cotizaciones/${id}`);
    return res.data;
  },
  actualizarDespiece: async (id, payload) => {
    const res = await api.put(`/despieces_detalles/${id}/actualizarPiezas`, payload);
    return res.data;
  },
};

export default centroAtencionService;