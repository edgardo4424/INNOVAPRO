module.exports = async (usuarioId, notificacionRepository) => {
  const notificaciones = await notificacionRepository.obtenerPorUsuario(usuarioId);
  return { codigo: 200, respuesta: { notificaciones } }
}