import api from "@/shared/services/api";

export async function obtenerCondicionesPendientes() {
  const res = await api.get("/condiciones/pendientes");
  return res.data;
}

export async function responderCondicion(id, condiciones) {
    const res = await api.put(`/condiciones/${id}`, {condiciones});
    return res.data;
}