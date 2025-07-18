import api from "@/shared/services/api";

export async function crearDespieceOT(payload) {
  const res = await api.post("/tareas/crear-despiece-ot", payload);
  return res.data;
}