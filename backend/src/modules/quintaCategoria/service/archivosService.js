import api from "@/shared/services/api";

/**
 * Sube un archivo de quinta (PDF/JPG/PNG) y retorna la URL pública.
 * @param {'multiempleo'|'certificado'|'sinprevios'} categoria
 * @param {string} dni
 * @param {number|string} anio
 * @param {File} file
 */
export async function uploadQuintaArchivo(categoria, dni, anio, file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post(`/archivos/quinta/upload`, form, {
    params: { categoria, dni, anio },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data?.url || null;
}