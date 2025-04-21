module.exports = async (id, notificacionRepository) => {
  const notificacion = await notificacionRepository.marcarComoLeida(id);
  if (!notificacion) {
    return { codigo: 404, respuesta: { mensaje: "Notificación no encontrada" } };
  }

  // Al marcar como leido se debe enviar una notificación al usuario que creo la tarea?

  return { codigo: 200, respuesta: { mensaje: "Notificación marcada como leída" } };
}