import api from "@/shared/services/api";

// Acá encapsulamos todas las llamadas del frontend al backend.
// Cuando un usuario pide una previsualización, este servicio toma el payload que se construye en el hook y
// lo entrega a /quintaCategoria/previsualizar, lo que devuelve el cálculo proyectado.
// Si el usuario confirma, el servicio llama a /quintaCategoria para guardar el cálculo oficial.
// Si más adelante hay que recalcular, el servicio llama a /quintaCategoria/:id/recalcular
// Y para ver el historial del año, llamamos a /quintaCategoria con filtros DNI y anio

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
  api.get("/quintaCategoria/multiempleo/declaracion", { params: {dni, anio }});

export const quintaGuardarMulti = (payload) =>
  api.post("/quintaCategoria/multiempleo/declaracion", payload);

// CERTIFICADO DE 5ta
export const quintaObtenerCertificado = (dni, anio) =>
  api.get("/quintaCategoria/certificado", { params: { dni, anio }});

export const quintaGuardarCertificado = (payload) =>
  api.post("/quintaCategoria/certificado", payload);

// DECLARACION JURADA "SIN PREVIOS"
export const quintaObtenerSinPrevios = (dni, anio) =>
  api.get("/quintaCategoria/sin-previos", { 
    params: { dni, anio, _ts: Date.now() },
    headers: { 'Cache-Control': 'no-cache' },
  });

export const quintaGuardarSinPrevios = (payload) =>
  api.post("/quintaCategoria/sin-previos", payload);