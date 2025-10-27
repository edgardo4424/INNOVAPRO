import api from "@/shared/services/api";

// Árbol completo: Filial -> Usos -> Plantillas
export function getPlantillasArbol() {
  return api.get("/plantillas/contratos/arbol").then(r => r.data);
}

// Búsqueda por filtros (filial_id obligatorio; uso opcional; q opcional)
export function searchPlantillas({ filial_id, uso, q }) {
  const params = {};
  if (filial_id) params.filial_id = filial_id;
  if (uso) params.uso = uso;              // “01. CONTRATOS (CC)”, “04. TRANSPORTE”, “06. LETRAS”, etc.
  if (q) params.q = q;
  return api.get("/plantillas/contratos", { params }).then(r => r.data);
}

// GET /api/contratos/plantillas?filial_id=&uso=
export function listarPlantillasAPI(params) {
  return api.get("/contratos/plantillas", { params }).then(r => r.data);
}

// GET /api/contratos/:contratoId/documentos
export function listarHistorialAPI(contratoId) {
  return api.get(`/contratos/${contratoId}/documentos`).then(r => r.data);
}

// POST /api/contratos/:contratoId/documentos/render
export function renderDocumentoAPI(contratoId, payload) {
  return api.post(`/contratos/${contratoId}/documentos/render`, payload).then(r => r.data);
}

// POST /api/contratos/:contratoId/documentos/final  (multipart)
export function subirFinalAPI(contratoId, { docx, pdf }) {
  const form = new FormData();
  if (docx) form.append("file_docx", docx);
  if (pdf) form.append("file_pdf", pdf);
  return api.post(`/contratos/${contratoId}/documentos/final`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data);
}

// POST /api/contratos/:contratoId/oficializar  (pendiente backend)
export function oficializarAPI(contratoId) {
  // Mientras Luis implementa el backend real, dejamos un stub que devuelve OK para demo.
  // Reemplázalo por: return api.post(`/contratos/${contratoId}/oficializar`).then(r => r.data);
  return Promise.resolve({ ok: true });
}