const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");


// ✅ Importamos el servicio de envío por WhatsApp
const enviarMensajeWhatsAppFinalizaTarea = require("../../infrastructure/services/enviarMensajeFinalizaTarea");

module.exports = async (idTarea, idUsuario, tareaRepository) => {

  // id de la tarea e id del usuario del middleware (idUsuario)

  const tarea = await tareaRepository.finalizarTarea(idTarea, idUsuario);

  if (!tarea) {
    return {
      codigo: 403,
      respuesta: { mensaje: "No puedes finalizar esta tarea" },
    };
  }

  // ✅ Notificar al tecnico

  const notificacionParaElTecnico = {
    usuarioId: idUsuario,
    mensaje: `Has finalizado la tarea #${tarea.id}`,
    tipo: "exito",
  };

  const notiTecnico = await notificacionRepository.crear(
    notificacionParaElTecnico
  );

  emitirNotificacionPrivada(notiTecnico.usuarioId, notiTecnico);

  // ✅ Notificar al creador

  try {
    const notificacionParaElCreador = {
      usuarioId: tarea.usuarioId, // id del creador de tarea
      mensaje: `El técnico ${tarea.tecnico_asignado.trabajador?.nombres} ha finalizado la tarea #${tarea.id}.`,
      tipo: "exito",
    };

    const notiCreador = await notificacionRepository.crear(
      notificacionParaElCreador
    );

    await enviarMensajeWhatsAppFinalizaTarea(
      `51${notiCreador.usuario.telefono}`, // formato internacional, ejemplo: "51987654321"
      //  '51912617842',
      notiCreador.usuario.trabajador?.nombres,
      tarea.id
    );

    emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador);
  } catch (error) {
    console.error("❌ Error al enviar notificación al creador:", error.response?.data || error.message);
  }
  const notificacionParaElCreador = {
    usuarioId: tarea.usuarioId, // id del creador de tarea
    mensaje: `El técnico ${tarea.tecnico_asignado.trabajador?.nombres} ha finalizado la tarea #${tarea.id}.`,
    tipo: "exito",
  };

  const notiCreador = await notificacionRepository.crear(
    notificacionParaElCreador
  );

  emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador);

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea finalizada con éxito",
      tarea: tarea,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
