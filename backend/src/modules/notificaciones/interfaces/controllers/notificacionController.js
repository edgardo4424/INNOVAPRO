const db = require("../../../../models");
const obtenerNotificaciones = require("../../application/useCases/obtenerNotificaciones");
const marcarComoLeida = require("../../application/useCases/marcarComoLeida");
const SequelizeNotificacionesRepository = require("../../infrastructure/repositories/SequelizeNotificacionesRepository");

const notificacionesRepository = new SequelizeNotificacionesRepository(db.notificaciones);

const NotificacionController = {
  async listar(req, res) {
    const resultado = await obtenerNotificaciones(req.usuario.id, notificacionesRepository);
    res.status(resultado.codigo).json(resultado.respuesta);
  },

  async marcarComoLeida(req, res) {
    const resultado = await marcarComoLeida(req.params.id, notificacionesRepository);
    res.status(resultado.codigo).json(resultado.respuesta);
  }
}

module.exports = NotificacionController;
