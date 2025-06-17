const db = require("../../../../models");

const Despiece = require("../../../despieces/domain/entities/despiece");
const DespieceDetalle = require("../../../despieces_detalles/domain/entities/despieces_detalles");

module.exports = async (dataDespiece, tareaRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const tarea = await tareaRepository.obtenerPorId(dataDespiece.idTarea);
    if (!tarea)
      return { codigo: 404, respuesta: { mensaje: "Tarea no encontrado" } };

    if (tarea.detalles?.apoyoTecnico == "Despiece") {
      const despieceGuardar = {
        cp: "1.1",
        moneda: "PEN",
      };

      // Insertar despiece con el cp 1.1 sin los subtotales
      const nuevoDespiece = await db.despieces.create(despieceGuardar, {
        transaction,
      });

      console.log("nuevoDespiece", nuevoDespiece);

      const despiece_id = nuevoDespiece.id;

      // Insertar el despiece manual brindado por OT

      if (dataDespiece.despiece.length == 0) {
        return {
          codigo: 400,
          respuesta: { mensaje: "No hay piezas en el despiece" },
        };
      }

      const despieceManual = dataDespiece.despiece.map((pieza) => ({
        ...pieza,
        despiece_id,
      }));

      await db.despieces_detalle.bulkCreate(despieceManual, { transaction });

      // Crear la cotizacion pero en estado
      const ESTADO_COTIZACION_POR_APROBAR = 3; // Estado por aprobar por el comercial

      const dataCotizacion = {
        despiece_id: despiece_id,
        contacto_id: tarea.contactoId,
        cliente_id: tarea.clienteId,
        obra_id: tarea.obraId,
        filial_id: tarea.empresaProveedoraId,
        usuario_id: tarea.usuarioId,
        estados_cotizacion_id: ESTADO_COTIZACION_POR_APROBAR,
        uso_id: tarea.usoId,
      };

      console.log('dataCotizacion', dataCotizacion);

      await db.cotizaciones.create(dataCotizacion, { transaction });
    } else {
      return {
        codigo: 400,
        respuesta: { mensaje: "No se solicitó un despiece para la tarea" },
      };
    }

    await transaction.commit(); // ✔ Confirmar todo
    return { codigo: 201, respuesta: tarea };
  } catch (error) {
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    console.error("Error en registrar despiece manual:", error);
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al registrar despiece manual" },
    };
  }
};
