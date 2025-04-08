import axios from "axios";

// 🔥 Detectamos si estamos en desarrollo o producción
const API_URL =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL;

    // 🔥 Verificar si la variable está bien cargada
if (!API_URL) {
  console.error("⚠️ ERROR: No se encontró REACT_APP_API_URL_PROD o REACT_APP_API_URL en el entorno.");
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 2400000,
  headers: { "Content-Type": "application/json" },
});

// Agregar token automáticamente a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => Promise.reject(error)
);

// Manejo de errores 401 (sesión expirada)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const buscarDatosPorRUC = async (ruc) => {
  try {
    const res = await api.get(`/ruc/buscar-ruc/${ruc}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error buscando RUC en SUNAT:", error);
    return null;
  }
};

export default api;