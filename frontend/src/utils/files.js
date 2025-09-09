import api from "@/shared/services/api"; // tiene baseURL del backend

export function resolveFileUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = api?.defaults?.baseURL?.replace(/\/api\/?$/, "") || "";
  return url.startsWith("/uploads") ? `${base}${url}` : url;
}