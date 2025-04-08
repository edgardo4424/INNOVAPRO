const db = require("../models");
const { emitirNotificacionUsuario } = require("../utils/notificaciones");

/**
 * El técnico toma la tarea y se asigna a sí mismo.
 */
async function tomarTarea(idTarea, usuario) {
    const tarea = await db.tareas.findByPk(idTarea, {
      include: [{ model: db.usuarios, as: "usuario_solicitante" }],
    });
  
    if (!tarea) throw { status: 404, mensaje: "Tarea no encontrada" };
    if (tarea.asignadoA) throw { status: 400, mensaje: "Esta tarea ya está asignada a otro técnico" };
  
    tarea.asignadoA = usuario.id;
    tarea.estado = "En proceso";
    await tarea.save();
  
    // ✅ Notificar al técnico
    const notiTecnico = await db.notificaciones.create({
      usuarioId: usuario.id,
      mensaje: `Has tomado la tarea #${tarea.id}`,
      tipo: "tarea",
    });
  
    emitirNotificacionUsuario(notiTecnico); // 🔥 ENVÍA OBJETO COMPLETO
  
    // ✅ Notificar al creador
    if (tarea.usuario_solicitante) {
      const notiCreador = await db.notificaciones.create({
        usuarioId: tarea.usuario_solicitante.id,
        mensaje: `El técnico ${usuario.nombre} ha tomado tu tarea #${tarea.id}.`,
        tipo: "tarea",
      });
  
      emitirNotificacionUsuario(notiCreador); // 🔥 ENVÍA OBJETO COMPLETO
    }
  
    return tarea;
  }

/**
 * El técnico libera la tarea que tenía asignada.
 */
async function liberarTarea(idTarea, usuario) {
    const tarea = await db.tareas.findByPk(idTarea);
    if (!tarea || tarea.asignadoA !== usuario.id) {
        throw { status: 403, mensaje: "No puedes liberar esta tarea" };
    }

    tarea.asignadoA = null;
    tarea.estado = "Pendiente";
    await tarea.save();

    // Notificar al creador
    const notificacion = await db.notificaciones.create({
        usuarioId: tarea.usuarioId,
        mensaje: `El técnico ${usuario.nombre} ha liberado la tarea #${tarea.id}.`,
        tipo: "info",
    });

    emitirNotificacionUsuario(notificacion);

    return tarea;
}

/**
 * El técnico finaliza una tarea
 */
async function finalizarTarea(idTarea, usuario) {
    const tarea = await db.tareas.findByPk(idTarea);
    if (!tarea || tarea.asignadoA !== usuario.id) {
        throw { status: 403, mensaje: "No puedes finalizar esta tarea" };
    }

    tarea.estado = "Finalizada";
    await tarea.save();

    const notificacion = await db.notificaciones.create({
        usuarioId: tarea.usuarioId,
        mensaje: `Tu tarea #${tarea.id} ha sido finalizada.`,
        tipo: "exito",
    });

    emitirNotificacionUsuario(notificacion);

    return tarea;
}

/**
 * Devolver tarea al creador con motivo
 */
async function devolverTarea(idTarea, motivo) {
    const tarea = await db.tareas.findByPk(idTarea);
    if (!tarea) throw { status: 404, mensaje: "Tarea no encontrada" };

    if (typeof motivo !== "string") {
        throw { status: 400, mensaje: "Motivo de devolución inválido"};
    }

    await tarea.update({ estado: "Devuelta", motivoDevolucion: motivo });

    const notificacion = await db.notificaciones.create({
        usuarioId: tarea.usuarioId,
        mensaje: `Tu tarea #${tarea.id} ha sido devuelta y necesita correcciones.`,
        tipo: "advertencia",
    });

    emitirNotificacionUsuario(notificacion);

    return tarea;
}

/**
 * Corregir tarea devuelta
 */
async function corregirTarea(idTarea, correccion, usuarioId) {
    const tarea = await db.tareas.findByPk(idTarea, {
        include: [{ model: db.usuarios, as: "usuario_solicitante"}],
    });
    if (!tarea) throw { status: 404, mensaje: "Tarea no encontrada" };
    if (tarea.estado !== "Devuelta") throw { status: 403, mensaje: "Solo se pueden corregir tareas devueltas" };
    if (tarea.usuarioId !== usuarioId) throw { status: 403, mensaje: "No tienes permiso para corregir esta tarea" };

    const tecnicoId = tarea.asignadoA;

    await tarea.update({
        correccionComercial: correccion,
        estado: "Pendiente",
        asignadoA: null,
    });

    if (tecnicoId){
        const notificacion = await db.notificaciones.create({
            usuarioId: tecnicoId,
            mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${tarea.usuario_solicitante?.nombre || "desconocido"}.`,
            tipo: "info",
        });
    
        emitirNotificacionUsuario(notificacion);
    }
    
    return tarea;
}

module.exports = {
    tomarTarea,
    liberarTarea,
    finalizarTarea,
    devolverTarea,
    corregirTarea,
}; 