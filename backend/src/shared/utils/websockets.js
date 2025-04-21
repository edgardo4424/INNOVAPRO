const socketIo = require("socket.io");

let io;

// 🔥 Detectamos si estamos en desarrollo o producción
const CLIENT_URL = process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL_PROD || "https://erp.grupoinnova.pe"
    : process.env.FRONTEND_URL || "http://localhost:3000";

const inicializarWebSockets = (server) => {
    if (io) {
        console.log("⚠️ WebSockets ya inicializados. No se reinician.");
        return io;
    }

    io = require("socket.io")(server, {
        path: "/backend/api/socket.io", // 🔥 RUTA CORRECTA PARA WEBSOCKETS
        cors: {
            origin: CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
            transports: ["websocket", "polling"], // 🔥 FORZAR TRANSPORTES PERMITIDOS
        },
        allowEIO3: true, // 🔥 Compatibilidad con versiones anteriores de socket.io
    });

    io.on("connection", (socket) => {
        console.log("✅ Usuario conectado a WebSockets:", socket.id);

        socket.on("disconnect", () => {
            console.log("❌ Usuario desconectado de WebSockets");
        });

    });

    return io;
};

// ✅ FUNCIÓN para obtener instancia de io desde cualquier parte del backend
const getIo = () => {
    if (!io) {
        throw new Error("❌ WebSocket no inicializado");
    }
    return io;
};

module.exports = { inicializarWebSockets, getIo };