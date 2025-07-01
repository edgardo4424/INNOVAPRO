const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");


// ✅ Importamos el servicio de envío por WhatsApp
const enviarMensajeWhatsApp = require("../../infrastructure/services/enviarMensajeServiceTomaTarea");

module.exports = async (idTarea, correcion, tareaRepository) => {
  const usuarioIdTecnico = await tareaRepository.obtenerPorId(idTarea);

  const tarea = await tareaRepository.corregirTarea(idTarea, correcion);

  if (!tarea) {
    return {
      codigo: 403,
      respuesta: { mensaje: "No puedes corregir esta tarea" },
    };
  }

  // ✅ Notificar al tecnico

  const notificacionAlTecnico = {
    usuarioId: usuarioIdTecnico.asignadoA,
    mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${tarea.usuario_solicitante?.nombre || "desconocido"
      }.`,
    tipo: "info",
  };

  const notiRegistradoTecnico = await notificacionRepository.crear(
    notificacionAlTecnico
  );

  emitirNotificacionPrivada(
    notificacionAlTecnico.usuarioId,
    notiRegistradoTecnico
  );

  // ✅ Notificar al creador

  try {
    const notificacionAlCreador = {
      usuarioId: tarea.usuarioId,
      mensaje: `La tarea #${tarea.id} ha sido corregida`,
      tipo: "info",
    };

    const notiRegistradoCreador = await notificacionRepository.crear(
      notificacionAlCreador
    );

    console.log("notiRegistradoCreador", notiRegistradoCreador);
    await enviarMensajeWhatsApp(
      `51${notiRegistradoCreador.telefono}`, // formato internacional, ejemplo: "51987654321"
      notiRegistradoCreador.usuario.nombre,
      tarea.id
    );

    emitirNotificacionPrivada(
      notificacionAlCreador.usuarioId,
      notiRegistradoCreador
    );
  } catch (error) {
    console.error("❌ Error al enviar notificación al creador:", error.response?.data || error.message);
  }


  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea corregida con éxito",
      tarea: tarea,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
