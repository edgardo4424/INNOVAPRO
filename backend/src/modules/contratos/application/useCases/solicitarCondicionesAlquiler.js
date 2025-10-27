const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const { emitirNotificacionPrivada } = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");
const { enviarNotificacionTelegram } = require("../../../notificaciones/infrastructure/services/enviarNotificacionTelegram");

const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos

module.exports = async (contratoId, contratoRepository, transaction = null) => {
  const contrato = await contratoRepository.obtenerPorId(contratoId, transaction); // Obtengo el contrato por ID

  // Si no existe el contrato, o no lo encuentra, retorna un error
  if (!contrato) {
    return { codigo: 404, respuesta: { mensaje: "Contrato no encontrado" } };
  }

  console.log("Estado condiciones contrato:", contrato.estado_condiciones);
  // Si el estado_condiciones es Creado o es de tipo Alquiler, se puede solicitar condiciones, sino se retorna un error
  if (contrato.estado_condiciones != "Creado" || contrato.cotizacion.tipo_cotizacion !== "Alquiler") {
    return {
      codigo: 400,
      respuesta: { mensaje: "Solo se pueden solicitar condiciones si el contrato está en estado 'Creado' o si es 'Alquiler'" }
    };
  }

  // El estado_condiciones es 'Condiciones Solicitadas'
  // Actualizo el estado_condiciones del contrato a 'Condiciones Solicitadas'
  contrato.estado_condiciones = "Condiciones Solicitadas";
  await contratoRepository.actualizarEstadoCondiciones(contratoId, "Condiciones Solicitadas", transaction);

  // Notificamos al comercial que solicitó las condiciones por el ERP
  const notificacionParaElCreador = {
    usuarioId: contrato.usuario_id,
    mensaje: `Se realizó la solicitud de condiciones para el contrato: ${contrato.ref_contrato}`,
    tipo: "exito",
  };
 
  // Guardamos la notificación en la base de datos
  const notiCreador = await notificacionRepository.crear(
    notificacionParaElCreador
  );
  
  // Emitimos la notificación privada al usario que creó el contrato
  emitirNotificacionPrivada(notificacionParaElCreador.usuarioId, notiCreador);
  
  // Notificar al comercial que solicitó la las condiciones (TELEGRAM)
  const usuario = await db.usuarios.findByPk(contrato.usuario_id, {transaction}); // Buscamos al usuario que creó el contrato

  // Si el usuario hizo su registro en el sistema de notificaciones y tiene un id_chat de Telegram,
  // enviamos la notificación por Telegram
  
  if (usuario.id_chat) {
    try {
      await enviarNotificacionTelegram(usuario.id_chat, notificacionParaElCreador.mensaje);
    } catch (error) {
      
      throw new Error("❌ Error al intentar enviar notificación por Telegram:", error.message);
    }
  }

  return {
    codigo: 200,
    respuesta: { mensaje: "Condiciones de alquiler solicitadas correctamente" }
  };
};