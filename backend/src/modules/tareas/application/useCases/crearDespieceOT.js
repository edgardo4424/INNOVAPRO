const db = require("../../../../models");
const AtributosValor = require("../../../atributos_valor/domain/entities/atributos_valor");
const {
  mapearValoresAtributos,
} = require("../../../cotizaciones/infrastructure/services/mapearValoresAtributosService");

module.exports = async (dataDespiece, tareaRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const tarea = await tareaRepository.obtenerPorId(dataDespiece.idTarea);
    if (!tarea)
      return { codigo: 404, respuesta: { mensaje: "Tarea no encontrado" } };

    console.log("tarea", tarea);

    if (tarea.detalles?.apoyoTecnico == "Despiece") {
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

      console.log(tarea.atributos_valor_zonas);

      // Insertar Atributos Valor
      const atributosValor = await mapearValoresAtributos({
        uso_id: tarea.usoId,
        despiece_id,
        zonas: tarea.atributos_valor_zonas, // Vienen los atributos por zona
      });

      // Validación de todos los atributos valor
      for (const data of atributosValor) {
        const errorCampos = AtributosValor.validarCamposObligatorios(
          data,
          "crear"
        );
        if (errorCampos) {
          return {
            codigo: 400,
            respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
          };
        }
      }

      console.log("atributosValor", atributosValor);

      await db.atributos_valor.bulkCreate(atributosValor, { transaction });

      // Insertar el despiece manual brindado por OT

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

      console.log("dataCotizacion", dataCotizacion);

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
