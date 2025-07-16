const db = require("../../../../models");

const {
  mapearValoresAtributos,
} = require("../../../cotizaciones/infrastructure/services/mapearValoresAtributosService");

const sequelizeCotizacionRepository = require("../../../cotizaciones/infrastructure/repositories/sequelizeCotizacionRepository"); // Importamos el repositorio de cotizaciones
const cotizacionRepository = new sequelizeCotizacionRepository(); // Instancia del repositorio de cotizaciones

const SequelizeNotificacionesRepository = require("../../../notificaciones/infrastructure/repositories/SequelizeNotificacionesRepository"); // Importamos el repositorio de notificaciones
const notificacionRepository = new SequelizeNotificacionesRepository(); // Instancia del repositorio de notificaciones

const {
  emitirNotificacionPrivada,
} = require("../../../notificaciones/infrastructure/services/emisorNotificaciones");
const {
  enviarNotificacionTelegram,
} = require("../../../notificaciones/infrastructure/services/enviarNotificacionTelegram");

const ESTADO_TAREA_EN_PROCESO = "En proceso";

// Crear la cotizacion pero en estado
const ID_ESTADO_COTIZACION_DESPIECE_GENERADO = 2; // Estado por aprobar por el comercial

module.exports = async (dataDespiece, tareaRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const tarea = await tareaRepository.obtenerPorId(dataDespiece.idTarea);
    if (!tarea)
      return { codigo: 404, respuesta: { mensaje: "Tarea no encontrado" } };

    if (tarea.estado != ESTADO_TAREA_EN_PROCESO) {
      return {
        codigo: 400,
        respuesta: {
          mensaje: "La tarea debe estar 'En proceso' y debe ser tomada por OT",
        },
      };
    }
    if (
      tarea.detalles?.apoyoTecnico &&
      tarea.detalles?.apoyoTecnico.includes("Despiece")
    ) {
      if (dataDespiece.despiece.length == 0) {
        return {
          codigo: 400,
          respuesta: { mensaje: "No hay piezas en el despiece" },
        };
      }

      const despieceGuardar = {
        cp: "1.1",
        moneda: "PEN",
      };

      // Insertar despiece con el cp 1.1 sin los subtotales
      const nuevoDespiece = await db.despieces.create(despieceGuardar, {
        transaction,
      });

      const despiece_id = nuevoDespiece.id;

      // Insertar el despiece manual brindado por OT

      const despieceManual = dataDespiece.despiece.map((pieza) => ({
        ...pieza,
        despiece_id,
      }));

      await db.despieces_detalle.bulkCreate(despieceManual, { transaction });

      const dataCotizacionActualizar = {
        despiece_id: despiece_id,
        estados_cotizacion_id: ID_ESTADO_COTIZACION_DESPIECE_GENERADO,
      };

      await cotizacionRepository.actualizarCotizacion(
        tarea.cotizacionId,
        dataCotizacionActualizar,
        transaction
      );

      tarea.estado = "Finalizada";

      await tarea.save({ transaction });

      // Notificar al comercial que solicitó la tarea (ERP)

      const notificacionParaElCreador = {
        usuarioId: tarea.usuario_solicitante.id,
        mensaje: `Se generó el despiece para la cotizacion de la empresa: ${tarea.cliente.razon_social}`,
        tipo: "exito",
      };
      const notiCreador = await notificacionRepository.crear(
        notificacionParaElCreador
      );
      emitirNotificacionPrivada(
        notificacionParaElCreador.usuarioId,
        notiCreador
      );

      // Notificar al comercial que solicitó la tarea (TELEGRAM)
      const usuario = await db.usuarios.findByPk(tarea.usuarioId);

      if (usuario.id_chat) {
        try {
          await enviarNotificacionTelegram(
            usuario.id_chat,
            notificacionParaElCreador.mensaje
          );
        } catch (error) {
          console.error(
            "❌ Error al intentar enviar notificación por Telegram:",
            error.message
          );
          // Continúa normalmente
        }
      }
    } else {
      return {
        codigo: 400,
        respuesta: { mensaje: "No se solicitó un despiece para la tarea" },
      };
    }

    await transaction.commit(); // ✔ Confirmar todo
    return {
      codigo: 201,
      respuesta: { mensaje: "Despiece creado por OT correctamente." },
    };
  } catch (error) {
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    console.error("Error en registrar despiece manual:", error);
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al registrar despiece manual" },
    };
  }
};
