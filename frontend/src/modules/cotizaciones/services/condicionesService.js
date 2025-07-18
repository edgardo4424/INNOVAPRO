import api from "@/shared/services/api";

export async function obtenerCondicionesPorCotizacion(cotizacionId) {
  const res = await api.get(`/condiciones/${cotizacionId}`);
  return res.data;
}

export async function marcarCondicionesCumplidas(cotizacionId, condiciones) {
  const res = await api.put(`/condiciones/marcar-cumplidas/${cotizacionId}`, {
    condiciones_cumplidas: condiciones,
  });
  return res.data;
}