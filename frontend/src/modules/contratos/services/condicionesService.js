import api from "@/shared/services/api";

export async function obtenerCondicionesPorContrato(contratoId) {
  const res = await api.get(`/condiciones/${contratoId}`);
  return res.data;
}

export async function marcarCondicionesCumplidas(contratoId, condiciones) {
  const res = await api.put(`/condiciones/marcar-cumplidas/${contratoId}`, {
    condiciones_cumplidas: condiciones,
  });
  return res.data;
}