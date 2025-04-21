class SequelizeNotificacionesRepository {
  constructor(modelo) {
    this.modelo = modelo;
  }

  async obtenerPorUsuario(usuarioId) {
    return await this.modelo.findAll({
      where: {
        usuario_id: usuarioId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async marcarComoLeida(id) {
    const notificacion = await this.modelo.findByPk(id);
    if (!notificacion) return null;
    notificacion.leida = true;
    await notificacion.save();
    return notificacion;
  }
}

module.exports = SequelizeNotificacionesRepository;