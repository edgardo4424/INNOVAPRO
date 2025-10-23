const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository");
const notificacionRepository = new SequelizeNotificacionesRepository();

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

const enviarMensajeWhatsApp = require("../../infrastructure/services/enviarMensajeServiceTomaTarea");

module.exports = async (idTarea, correccion, user_id, user_name, tareaRepository) => {
  try {
    // 1️⃣ Obtenemos la tarea original (para saber a quién estaba asignada)
    const tareaOriginal = await tareaRepository.obtenerPorId(idTarea);
    if (!tareaOriginal) {
      return { codigo: 404, respuesta: { mensaje: "Tarea no encontrada" } };
    }

    // 2️⃣ Ejecutamos la corrección
    const tarea = await tareaRepository.corregirTarea(idTarea, correccion, user_id, user_name);
    if (!tarea) {
      return { codigo: 403, respuesta: { mensaje: "No puedes corregir esta tarea" } };
    }

    // 3️⃣ Notificar al técnico asignado (si existía)
    if (tareaOriginal.asignadoA) {
      const notificacionAlTecnico = {
        usuarioId: tareaOriginal.asignadoA,
        mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${tarea.usuario_solicitante?.trabajador?.nombres || user_name || "Desconocido"
          }.`,
        tipo: "info",
      };

      const notiRegistradoTecnico = await notificacionRepository.crear(notificacionAlTecnico);

      emitirNotificacionPrivada(
        notificacionAlTecnico.usuarioId,
        notiRegistradoTecnico
      );
    }

    // 4️⃣ Notificar al creador de la tarea
    try {
      const notificacionAlCreador = {
        usuarioId: tarea.usuarioId,
        mensaje: `La tarea #${tarea.id} ha sido corregida correctamente.`,
        tipo: "info",
      };

      const notiRegistradoCreador = await notificacionRepository.crear(notificacionAlCreador);

      // si tu modelo de notificaciones guarda usuario con teléfono:
      const telefono = notiRegistradoCreador?.usuario?.telefono || null;

      if (telefono) {
        await enviarMensajeWhatsApp(
          `51${telefono}`, // ejemplo: "51999999999"
          notiRegistradoCreador.usuario?.nombre || "Usuario",
          tarea.id
        );
      }

      emitirNotificacionPrivada(
        notificacionAlCreador.usuarioId,
        notiRegistradoCreador
      );
    } catch (error) {
      console.error("⚠️ Error al enviar notificación al creador:", error.response?.data || error.message);
    }

    // 5️⃣ Respuesta final
    return {
      codigo: 200,
      respuesta: {
        mensaje: "Tarea corregida con éxito",
        tarea,
      },
    };
  } catch (error) {
    console.error("💥 Error general al corregir tarea:", error);
    return {
      codigo: 500,
      respuesta: { mensaje: "Error interno al corregir tarea", detalle: error.message },
    };
  }
};
