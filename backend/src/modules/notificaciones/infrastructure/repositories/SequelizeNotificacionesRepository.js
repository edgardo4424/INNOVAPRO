const { Notificaciones } = require("../models/notificacionModel");
const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeNotificacionesRepository {
  constructor(modelo) {
    this.modelo = modelo;
  }

  async obtenerPorUsuario(usuarioId) {
    return await this.modelo.findAll({
      where: {
        usuarioId: usuarioId,
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

  // Crear una notificacion

  async crear(notificacionData) {
   
    const notificacion = await Notificaciones.create(notificacionData);
    // Volver a buscarla con el usuario asociado (opcionalmente en un solo paso si necesitas evitar dos queries)
    const notificacionConUsuario = await Notificaciones.findByPk(
      notificacion.id,
      {
        include: {
          model: db.usuarios, // o models.Usuario
          as: "usuario",
          attributes: ["id", "nombre"], // 👈 solo lo necesario
        },
      }
    );

    return notificacionConUsuario;
  }
}

module.exports = SequelizeNotificacionesRepository;
