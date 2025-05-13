const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

module.exports = async (idTarea, idUsuario, tareaRepository) => {

  // id de la tarea e id del usuario del middleware (idUsuario)
  
  const tarea = await tareaRepository.obtenerPorId(idTarea);

  if (!tarea) {
    return {
      codigo: 404,
      respuesta: { mensaje: "Tarea no encontrada" },
    };
  }

  if (tarea.asignadoA) {
    return {
      codigo: 400,
      respuesta: { mensaje: "Esta tarea ya está asignada a otro técnico" },
    };
  }

  const tareaTomada = await tareaRepository.tomarTarea(tarea, idUsuario);

  // ✅ Notificar al tecnico

  const notificacionParaElTecnico = {
    usuarioId: idUsuario,
    mensaje: `Has tomado la tarea #${tareaTomada.id}`,
    tipo: "tarea",
  };

  const notiTecnico = await notificacionRepository.crear(
    notificacionParaElTecnico
  );

  /* console.log(notiTecnico); */

  emitirNotificacionPrivada(notiTecnico.usuarioId, notiTecnico);

  /*  console.log(`El técnico ${notiTecnico.usuario.nombre} ha tomado tu tarea #${tarea.id}.`); */

  // ✅ Notificar al creador
  if (tarea.usuario_solicitante) {
    const notificacionParaElCreador = {
      usuarioId: tarea.usuario_solicitante.id,
      mensaje: `El técnico ${notiTecnico.usuario.nombre} ha tomado tu tarea #${tarea.id}.`,
      tipo: "tarea",
    };
    const notiCreador = await notificacionRepository.crear(
      notificacionParaElCreador
    );

    emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador); // 🔥 ENVÍA OBJETO COMPLETO
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea tomada con éxito",
      tarea: tareaTomada,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
