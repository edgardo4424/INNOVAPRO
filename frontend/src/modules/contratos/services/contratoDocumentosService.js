import api from "@/shared/services/api";

/**
 * GET /api/contratos/:contratoId/documentos
 * Debe responder:
 * {
 *   resumen: {
 *     contrato_id: number,
 *     codigo_contrato: string,
 *     filial_id: number|null,
 *     uso_id: number|null,
 *     oficializado: boolean,
 *     docx_ultimo_url: string|null
 *   },
 *   historial: DocumentoVersion[]
 * }
 * type DocumentoVersion = {
 *   id: number,
 *   version: number,
 *   estado: "borrador" | "final" | "oficializado",
 *   docx_url?: string|null,
 *   pdf_url?: string|null,
 *   created_at: string
 * }
 */
export function getResumenYHistorialAPI(contratoId) {
  return api.get(`/contratos/${contratoId}/documentos`).then(r => r.data);
}

/**
 * POST /api/contratos/:contratoId/documentos/render
 * body: {} (opcional)
 * resp: { documento: DocumentoVersion, docx_url: string }
 */
export function renderDocumentoAPI(contratoId, payload = {}) {
  return api.post(`/contratos/${contratoId}/documentos/render`, payload).then(r => r.data);
}

/**
 * POST /api/contratos/:contratoId/documentos/final
 * multipart: file_docx?, file_pdf?
 * resp: { documento: DocumentoVersion }
 */
export function subirFinalAPI(contratoId, { docx, pdf }) {
  const form = new FormData();
  if (docx) form.append("file_docx", docx);
  if (pdf) form.append("file_pdf", pdf);
  return api
    .post(`/contratos/${contratoId}/documentos/final`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(r => r.data);
}

/**
 * POST /api/contratos/:contratoId/oficializar
 * resp: { ok: true, oficializado: true, documento: DocumentoVersion }
 */
export function oficializarAPI(contratoId) {
  return api.post(`/contratos/${contratoId}/oficializar`).then(r => r.data);
}