import api from "@/shared/services/api";

// Estado: ¿cerrado?
export async function getEstadoCierre({ filialId, periodo }) {
  const res = await api.get('/quintaCategoria/cierres/estado', { params: { filialId, periodo } });
  return res?.data.cerrado === true;
}

// Cerrar período
export async function cerrarPeriodoQuinta({ filial_id, periodo }) {
  const res = await api.post('/quintaCategoria/cierres/cerrar', { filial_id, periodo }, { validateStatus: () => true });
  return { status: res.status ?? res?.data?.status ?? 0, data: res.data ?? res };
}

// Listar cierres por año
export async function listarCierres({ filialId, anio }) {
  const res = await api.get('/quintaCategoria/cierres', { params: { filialId, anio } });
  return res?.data?.data ?? [];
}