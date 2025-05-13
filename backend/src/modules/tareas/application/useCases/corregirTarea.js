const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");

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
    mensaje: `La tarea #${tarea.id} ha sido corregida por el comercial ${
      tarea.usuario_solicitante?.nombre || "desconocido"
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

  const notificacionAlCreador = {
    usuarioId: tarea.usuarioId,
    mensaje: `La tarea #${tarea.id} ha sido corregida`,
    tipo: "info",
  };

  const notiRegistradoCreador = await notificacionRepository.crear(
    notificacionAlCreador
  );

  emitirNotificacionPrivada(
    notificacionAlCreador.usuarioId,
    notiRegistradoCreador
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Tarea corregida con éxito",
      tarea: tarea,
    },
  };
}; // Exporta la función para que pueda ser utilizada en otros módulos
