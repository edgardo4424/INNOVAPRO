module.exports = async (id, notificacionRepository) => {
  const notificacion = await notificacionRepository.marcarComoLeida(id);
  if (!notificacion) {
    return { codigo: 404, respuesta: { mensaje: "Notificación no encontrada" } };
  }

  return { codigo: 200, respuesta: { mensaje: "Notificación marcada como leída" } };
}