import api from "@/shared/services/api";

export const quintaPreview = (payload) =>
  api.post("/quintaCategoria/previsualizar", payload);

export const quintaCrear = (payload) =>
  api.post("/quintaCategoria", payload);

export const quintaRecalc = (id, payload = {}) =>
  api.post(`/quintaCategoria/${id}/recalcular`, payload);

export const quintaList = (params) =>
  api.get("/quintaCategoria", { params });

// MULTIEMPLEO
export const quintaObtenerMulti = (dni, anio) =>
  api.get("/quintaCategoria/multiempleo/declaracion", { params: {dni, anio, _ts: Date.now() } });

export const quintaGuardarMulti = (payload) =>
  api.post("/quintaCategoria/multiempleo/declaracion", payload);

// CERTIFICADO DE 5ta
export const quintaObtenerCertificado = (dni, anio) =>
  api.get("/quintaCategoria/certificado", { params: { dni, anio, _ts: Date.now()}});

export const quintaGuardarCertificado = (payload) =>
  api.post("/quintaCategoria/certificado", payload);

// DECLARACION JURADA "SIN PREVIOS"
export const quintaObtenerSinPrevios = (dni, anio ) =>
  api.get("/quintaCategoria/sin-previos", { 
    params: { dni, anio, _ts: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });

export const quintaGuardarSinPrevios = (payload) =>
  api.post("/quintaCategoria/sin-previos", payload);