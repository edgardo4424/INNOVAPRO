import api from "@/shared/services/api";
import { toast } from "react-toastify";

/**
 * Sube un archivo de quinta (PDF/JPG/PNG) y retorna la URL pública.
 * @param {'multiempleo'|'certificado'|'sinprevios'} categoria
 * @param {string} dni
 * @param {number|string} anio
 * @param {File} archivo
 */
export async function uploadQuintaArchivo(categoria, dni, anio, archivo) {
  if (!archivo) return null;

  // Límite visible para el usuario (coherente con el backend)
  const MAX_MB = Number(import.meta.env.VITE_UPLOAD_MAX_MB || 20);
  const MAX_BYTES = MAX_MB * 1024 * 1024;

  // 1) Prevalidación en cliente (evita 413 del servidor)
  if (archivo.size > MAX_BYTES) {
    toast.error(`El archivo supera el límite de ${MAX_MB} MB.`);
    throw new Error(`El archivo supera el límite de ${MAX_MB} MB.`);
  }

  const form = new FormData();
  form.append("file", archivo);

  try {
    const { data } = await api.post("/archivos/quinta/upload", form, {
      headers: { "Content-Type": "multipart/form-data", "Cache-Control": "no-cache" },
      params: { categoria, dni, anio },
      maxBodyLength: Infinity,
      timeout: 2_400_000,
    });

    const url =
      data?.url ??
      data?.data?.url ??
      (data?.ok ? data?.data?.url : null);

    return url || null;
  } catch (e) {
    // 2) Mensajes claros según status
    const status = e?.response?.status;
    const backendMsg = e?.response?.data?.message;
    if (status === 413) {
      const MAX_MB = Number(import.meta.env.VITE_UPLOAD_MAX_MB || 20);
      toast.error(`El archivo supera el límite de ${MAX_MB} MB.`);
      throw new Error(`El archivo supera el límite de ${MAX_MB} MB.`);
    }
    throw new Error(backendMsg || e?.message || "Error al subir el archivo.");
  }
}