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

    io = socketIo(server, {
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

        socket.on("nuevaNotificacion", (data) => {
            io.emit(`notificacion_${data.usuarioId}`, data);
        });

        socket.on("notificacion_leida", (data) => {
            console.log(`📢 Notificación marcada como leída en tiempo real: ${data.id}`);
            io.emit(`notificacion_leida_${data.usuarioId}`, data);
        });

        socket.on("disconnect", () => {
            console.log("❌ Usuario desconectado de WebSockets");
        });

        // 🔥 Prueba de conexión para verificar que funciona
        socket.emit("test_connection", { message: "🔥 WebSocket funcionando!" });
    });

    return io;
};

const getIo = () => io;

const enviarNotificacion = (usuarioId, mensaje, tipo) => {
    if (!io) {
        console.error("❌ WebSockets no inicializados.");
        return;
    }
    console.log(`📢 Enviando notificación a usuario ${usuarioId}: ${mensaje} (${tipo})`);
    io.emit(`notificacion_${usuarioId}`, { usuarioId, mensaje, tipo });
};

module.exports = { inicializarWebSockets, enviarNotificacion, getIo };