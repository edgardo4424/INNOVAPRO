import axios from "axios";

// Esta configuración de Axios es la base de todas las llamadas HTTP a la API del backend.
// Utiliza variables de entorno para definir la URL base y manejar el token de autenticación.
// Es una instancia centralizada de axios que todos los servicios de la app la pueden utilizar

// Detectamos si estamos en desarrollo o producción
const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL;

// Verificamos si las variables de entorno están bien cargada
if (!API_URL) {
  console.error("⚠️ ERROR: No se encontró VITE_API_URL_PROD o VITE_API_URL en el entorno.");
}

// Creamos una instancia de Axios con la configuración base
// Establecemos un timeout largo para evitar problemas de conexión en operaciones pesadas como la generación de PDF
const api = axios.create({
  baseURL: API_URL,
  timeout: 2400000,
  headers: { "Content-Type": "application/json" },
});

// Ejecutamos un interceptor antes de cada solicitud HTTP [api.get(...), api.post(...), etc.]
api.interceptors.request.use((config) => {
    // La idea es pasar el token guardado del usuario en el header para todas las solicitudes
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Ejecutamos un interceptor de todas las respuestas del backend para verificar si no a vencido la sesión
api.interceptors.response.use(
  (response) => response, // Si existe una respuesta es que no hay problema y la devolvemos tal como llega
  (error) => { // Pero si hay un error, verificamos si es un 417
    if (error.response?.status === 417) { // Si efectivamente es, significa que se venció la sesión
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      // Limipamos y redirigimos
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const LOGIN_URL = process.env.NODE_ENV === "production" ? "/#/login" : "/login";
      window.location.href = LOGIN_URL; // Redirigir al login
    }
    return Promise.reject(error); // Si no, simplemente devolvemos el error para que lo maneje el que hizo la llamada
  }
);

export default api;