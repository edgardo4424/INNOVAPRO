const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/sequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

module.exports = async (idTarea, idUsuario, correcion, tareaRepository) => {
  
    // id de la tarea e id del usuario del middleware (idUsuario)
    
  const tarea = await tareaRepository.corregirTarea(idTarea, correcion, idUsuario);

  if (!tarea) {
    return {
      codigo: 403,
      respuesta: { mensaje: "No puedes corregir esta tarea" },
    };
  }

  // ✅ Notificar al tecnico

  const notificacion = {
    usuarioId: tecnicoId,
    mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${tarea.usuario_solicitante?.nombre || "desconocido"}.`,
    tipo: "info",
}

  const notiRegistrado = await notificacionRepository.crear(notificacion);

  emitirNotificacionPrivada(notiRegistrado.usuarioId, notiRegistrado);

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea corregida con éxito",
      tarea: tarea,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
