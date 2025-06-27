const { getIo } = require("../../../../shared/utils/websockets");

function emitirNotificacionGlobal(notificacion) {
    const io = getIo();
    io.emit("nuevaNotificacion", notificacion);
}

function emitirNotificacionPrivada(usuarioId, notificacion) {
    if (!usuarioId || !notificacion) {
        console.error("Error: usuarioId o notificacion no definidos.");
        return;
    }

    const io = getIo();
    io.emit(`notificacion_usuario_${usuarioId}`, notificacion);
   
}

module.exports = {
    emitirNotificacionGlobal,
    emitirNotificacionPrivada,
};