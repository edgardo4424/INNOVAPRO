const { getIo } = require("../../../../shared/utils/websockets");

function enviarNotificacionDeAutenticacionTelegram(usuarioId, notificacion) {
    console.log('notificacion', notificacion);
    const io = getIo();
     io.emit(`notificacion_telegram_usuario_${usuarioId}`, notificacion);
}

module.exports = {
    enviarNotificacionDeAutenticacionTelegram
};