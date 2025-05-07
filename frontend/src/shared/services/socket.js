import { io } from "socket.io-client";

// Carga desde el .env para máxima flexibilidad
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/backend/api/socket.io";

const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  transports: ["websocket", "polling"],
  withCredentials: true,
  allowEIO3: true,
  autoConnect: false,
});

socket.connect();

export default socket;