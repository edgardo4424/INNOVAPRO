import api from "@/shared/services/api";

export async function ejecutarQuintaMasivo(payload) {
  const body = {
    anio: Number(payload.anio),
    mes: Number(payload.mes),
    filialId: Number(payload.filialId),
  };
  const { data } = await api.post("/quintaCategoria/masivo", body);
  return data;
}