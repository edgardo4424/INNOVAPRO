import axios from "axios";

// 🔥 Detectamos si estamos en desarrollo o producción
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

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

export default api;