// Este archivo crea y exporta la instancia global de conexión WebSocket para toda la app. 
// Es usado principalmente por el sistema de notificaciones en tiempo real, 
// pero puede ser reutilizado para otros propósitos (chat interno, tareas asignadas en vivo, etc).

import { io } from "socket.io-client";

// Carga desde el .env para máxima flexibilidad entre DEV Y PROD
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/backend/api/socket.io";

const socket = io(SOCKET_URL, { // Iniciamos la conexión con el backend Websocket
  path: SOCKET_PATH, // Ruta exacta donde vive el servidor de socket
  transports: ["websocket", "polling"],
  withCredentials: true,
  allowEIO3: true,
  autoConnect: false,
  reconnection:false
});

// Aquí hacemos la conexión manualmente porque pusimos el autoConnect false
export const conectarSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Función para desconectar manualmente
export const desconectarSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;