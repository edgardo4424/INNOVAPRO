const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const { emitirNotificacionPrivada } = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");
const { enviarNotificacionTelegram } = require("../../../notificaciones/infrastructure/services/enviarNotificacionTelegram");

const db = require("../../../../models");

module.exports = async (cotizacionId, cotizacionRepository) => {
  const cotizacion = await cotizacionRepository.obtenerPorId(cotizacionId); // Obtengo la cotización por ID 

  // Si no existe la cotización, o no la encuentra, retorna un error
  if (!cotizacion) {
    return { codigo: 404, respuesta: { mensaje: "Cotización no encontrada" } };
  }
  
  // El estados_cotizacion_id = 3 es 'Por Aprobar'
  // Si la cotización está Por Aprobar o es de tipo Alquiler, se puede solcitar condiciones, sino se retorna un error
  if (cotizacion.estados_cotizacion_id !== 3 || cotizacion.tipo_cotizacion !== "Alquiler") {
    return {
      codigo: 400,
      respuesta: { mensaje: "Solo se pueden solicitar condiciones si la cotización está en estado 'POR APROBAR' o si es 'Alquiler'" }
    };
  }

  // El estados_cotizacion_id = 7 es 'Condiciones Solicitadas'
  // Actualizo el estado de la cotización a 'Condiciones Solicitadas'
  cotizacion.estados_cotizacion_id = 7; 
  await cotizacionRepository.actualizarEstado(cotizacionId, 7);
  
  // Notificamos al comercial que solicitó las condiciones por el ERP
  const notificacionParaElCreador = {
    usuarioId: cotizacion.usuario_id,
    mensaje: `Se realizó la solicitud de condiciones para la cotización: ${cotizacion.codigo_documento}`,
    tipo: "exito",
  };
 
  // Guardamos la notificación en la base de datos
  const notiCreador = await notificacionRepository.crear(
    notificacionParaElCreador
  );
  
  // Emitimos la notificación privada al usario que creó la cotización
  emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador);
  
  // Notificar al comercial que solicitó la las condiciones (TELEGRAM)
  const usuario = await db.usuarios.findByPk(cotizacion.usuario_id); // Buscamos al usuario que creó la cotización

  // Si el usuario hizo su registro en el sistema de notificaciones y tiene un id_chat de Telegram,
  // enviamos la notificación por Telegram
  
  if (usuario.id_chat) {
    try {
      await enviarNotificacionTelegram(usuario.id_chat, notificacionParaElCreador.mensaje);
    } catch (error) {
      console.error("❌ Error al intentar enviar notificación por Telegram:", error.message);
    }
  }

  return {
    codigo: 200,
    respuesta: { mensaje: "Condiciones de alquiler solicitadas correctamente" }
  };
};