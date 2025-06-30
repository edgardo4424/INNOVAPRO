const db = require("../../../../models");
const obtenerNotificaciones = require("../../application/useCases/obtenerNotificaciones");
const marcarComoLeida = require("../../application/useCases/marcarComoLeida");
const SequelizeNotificacionesRepository = require("../../infrastructure/repositories/SequelizeNotificacionesRepository");
const {
   enviarNotificacionTelegram,
} = require("../../infrastructure/services/enviarNotificacionTelegram");

const notificacionesRepository = new SequelizeNotificacionesRepository(
   db.notificaciones
);

const NotificacionController = {
   async listar(req, res) {
      const resultado = await obtenerNotificaciones(
         req.usuario.id,
         notificacionesRepository
      );
      res.status(resultado.codigo).json(resultado.respuesta);
   },

   async marcarComoLeida(req, res) {
      const resultado = await marcarComoLeida(
         req.params.id,
         notificacionesRepository
      );
      res.status(resultado.codigo).json(resultado.respuesta);
   },
   async enviarNotificacionTelegram(req, res) {
      
      try {
         const response= await enviarNotificacionTelegram(
            req.params.id_chat,
            "🔔 Notificación de prueba: tu cuenta de Telegram ha sido conectada exitosamente al ERP de InnovaPro."
         );
         console.log('la respuesta es ',response);
         
         res.status(201).json({
            status: true,
         });
      } catch (error) {         
         return res.status(404).json({
            status: false,
            message:error.message
         });
      }
   },
};

module.exports = NotificacionController;
