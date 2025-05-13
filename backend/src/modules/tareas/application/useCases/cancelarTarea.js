const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

module.exports = async (idTarea, idUsuario, tareaRepository) => {
  
    // id de la tarea e id del usuario del middleware (idUsuario)
    
  const tarea = await tareaRepository.cancelarTarea(idTarea, idUsuario);

  if (!tarea) {
    return {
      codigo: 403,
      respuesta: { mensaje: "No puedes cancelar esta tarea" },
    };
  }

  // ✅ Notificar al tecnico

  const notificacionParaElTecnico = {
    usuarioId: idUsuario,
    mensaje: `Has cancelado la tarea #${tarea.id}`,
    tipo: "info",
  };

  const notiTecnico = await notificacionRepository.crear(
    notificacionParaElTecnico
  );

  emitirNotificacionPrivada(notiTecnico.usuarioId, notiTecnico);

  // ✅ Notificar al creador

  const notificacionParaElCreador = {
    usuarioId: tarea.usuarioId, // id del creador de tarea
    mensaje: `El técnico ${tarea.tecnico_asignado.nombre} ha cancelado la tarea #${tarea.id}.`,
    tipo: "info",
  };

  const notiCreador = await notificacionRepository.crear(
    notificacionParaElCreador
  );

  emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador);

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea cancelada con éxito",
      tarea: tarea,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
