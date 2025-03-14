const socketIo = require("socket.io");

let io;

const inicializarWebSockets = (server) => {
    if (io) {
        console.log("⚠️ WebSockets ya inicializados. No se reinician.");
        return io;
    }

    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("✅ Usuario conectado a WebSockets");

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