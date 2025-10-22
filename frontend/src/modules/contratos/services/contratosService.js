// INNOVA PRO+ v1.2.0 - Contratos
import api from "@/shared/services/api";

// CRUD
export async function crearContrato(payload) {
  const { data } = await api.post("/contratos", payload);
  return data; // { id, ... }
}
export async function obtenerContratos(params = {}) {
  const { data } = await api.get("/contratos", { params });
  return data; // { items, total }
}
export async function obtenerContratoPorId(id) {
  const { data } = await api.get(`/contratos/${id}`);
  return data;
}
export async function generarPDFContrato(id) {
  const { data } = await api.post(`/contratos/${id}/generar-pdf`, {}, { responseType: "blob" });
  return data; // blob
}
// Solicitar condiciones de alquiler al área de administración
export async function solicitarCondiciones(idCotizacion, comentario="") {
  const res = await api.put(`/cotizaciones/${idCotizacion}/solicitar-condiciones`, {
    comentario,
  })
  return res.data;
}

// Integraciones de wizard (si existen en backend de plantillas/preview)
const contratosService = {
  getCotizacionSnapshot: (cotizacionId) => api.get(`/cotizaciones/${cotizacionId}/snapshot`),
  getPlantillas: (filtro) => api.get(`/contratos/plantillas`, { params: filtro }),
  preview: (payload) => api.post(`/contratos/preview`, payload),
  crearDesdeCotizacion: (payload) => api.post(`/contratos/crear-desde-cotizacion`, payload),
};
export default contratosService;