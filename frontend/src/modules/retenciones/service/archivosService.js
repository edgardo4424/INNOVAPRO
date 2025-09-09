import api from "@/shared/services/api";

/**
 * Sube un archivo de quinta (PDF/JPG/PNG) y retorna la URL pública.
 * @param {'multiempleo'|'certificado'|'sinprevios'} categoria
 * @param {string} dni
 * @param {number|string} anio
 * @param {File} archivo
 */
export async function uploadQuintaArchivo(categoria, dni, anio, archivo) {
  if (!archivo) return null;
  const form = new FormData();
  form.append('file', archivo);

  const resp = await api.post(
    `/archivos/quinta/upload`, 
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: { categoria, dni, anio }
    }
  );

  return resp.data?.url || null;

}