const { getIo } = require("./websockets");
const db = require("../models");

/**
 * 🔥 Emite una notificación en tiempo real basada en un objeto de notificación
 * @param {Object} notificacion - Objeto con { id, mensaje, tipo, usuarioId }
 */
function emitirNotificacionUsuario(notificacion) {
    const io = getIo();
  
    if (!io) {
      console.warn("⚠️ Socket no inicializado");
      return;
    }
    
    
    // Desestructuramos los campos esenciales y opcionales
    const { mensaje, tipo, usuarioId, id } = notificacion;
    
    // Validación básica
    if (!mensaje || !tipo || !usuarioId) {
      console.warn("❌ Notificación malformada. No se emitirá:", notificacion);
      return;
    }
    
    // Armamos el payload estándar
    const payload = { mensaje, tipo, usuarioId };
    if (id) payload.id = id;
    
    // Log en consola para monitoreo
    console.log(`📢 Notificación emitida a notificacion_${usuarioId}:`, payload);
    
    // Emitimos al canal global correspondiente
    io.emit(`notificacion_${usuarioId}`, payload);
  }

/**
 * 🔥 Emite una notificación en tiempo real para un canal global
 * @param {Object} notificacion - Objeto con { tipo, mensaje, [id], [extra] }
 * El canal será `notificacion_global_<tipo>`
 */
function emitirNotificacionGlobal(notificacion) {
    const io = getIo();

    if (!io) {
        console.error("❌ WebSockets no disponibles para emitir notificación global");
        return;
    }

    // Desestructuramos los campos esenciales y opcionales
    const { tipo, mensaje, id, ...extra } = notificacion;

    // Validación básica
    if (!tipo || !mensaje) {
        console.warn("⚠️ Notificación global malformada. Se necesita al menos 'tipo' y 'mensaje':", notificacion);
        return;
    }

    // Armamos el payload estándar
    const payload = { mensaje, tipo };
    if (id) payload.id = id;

    // Adjuntamos cualquier otro dato adicional si se pasa
    Object.assign(payload, extra);

    // Canal global formateado
    const canal = `notificacion_global_${tipo}`;

    // Emitimos al canal global correspondiente
    io.emit(canal, payload);

    // Log en consola para monitoreo
    console.log(`📢 Notificación global emitida a canal ${canal}:`, payload);
}

module.exports = {
    emitirNotificacionUsuario,
    emitirNotificacionGlobal,
};