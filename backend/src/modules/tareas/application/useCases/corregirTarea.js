// backend/src/modules/tareas/application/useCases/corregirTarea.js
const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/sequelizeNotificacionesRepository");
const notificacionRepository = new SequelizeNotificacionesRepository();

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

module.exports = async (idTarea, idUsuario, correccion, tareaRepository) => {
  // 🔍 Buscar y corregir la tarea
  const tarea = await tareaRepository.corregirTarea(idTarea, correccion, idUsuario);

  if (!tarea) {
    return {
      codigo: 403,
      respuesta: { mensaje: "No puedes corregir esta tarea" },
    };
  }

  // ✅ Notificar al técnico si está asignado
  const tecnicoId = tarea.tecnico_asignado?.id;
  if (tecnicoId) {
    try {
      const notificacion = {
        usuarioId: tecnicoId,
        mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${tarea.usuario_solicitante?.nombre || "desconocido"}.`,
        tipo: "info",
      };

      const notiRegistrado = await notificacionRepository.crear(notificacion);
      emitirNotificacionPrivada(notiRegistrado.usuarioId, notiRegistrado);
    } catch (error) {
      console.error("❌ Error al enviar notificación de corrección:", error.message);
    }
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea corregida con éxito",
      tarea: tarea,
    },
  };
};