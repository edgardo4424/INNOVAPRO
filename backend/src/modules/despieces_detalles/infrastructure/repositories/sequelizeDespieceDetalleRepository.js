const { DespieceDetalle } = require("../models/despieceDetalleModel");
const db = require("../../../../database/models");
const {
  Cotizacion,
} = require("../../../cotizaciones/infrastructure/models/cotizacionModel");
const { Pieza } = require("../../../piezas/infrastructure/models/piezaModel");

class sequelizeDespieceDetalleRepository {
  getModel() {
    return require("../models/despieceDetalleModel").DespieceDetalle; // Retorna el modelo de cliente
  }

  async crear(despieceDetalleData) {
    return await DespieceDetalle.create(despieceDetalleData);
  }

  async obtenerDespiecesDetalle() {
    return await DespieceDetalle.findAll();
  }

  async obtenerPorId(id) {
    return await DespieceDetalle.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
  }

  async actualizarDespieceDetalle(id, despieceDetalleData) {
    const despieceDetalle = await DespieceDetalle.findByPk(id); // Busca el despieceDetalle por ID
    if (!despieceDetalle) {
      // Si no se encuentra el despieceDetalle, retorna null
      console.log("❌ Despiece Detalle no encontrado");
      return null;
    }
    await despieceDetalle.update(despieceDetalleData); // Actualiza el despieceDetalle con los nuevos datos
    return despieceDetalle; // Retorna el despieceDetalle actualizado
  }

  async eliminarDespieceDetalle(id) {
    const despieceDetalle = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el despieceDetalle por ID
    if (!despieceDetalle) return null; // Si no se encuentra el despieceDetalle, retorna null
    return await despieceDetalle.destroy(); // Elimina el despieceDetalle y retorna el resultado
  }

  async crearVariosDespiecesDetalles(listaDespiecesDetalles) {
    return await DespieceDetalle.bulkCreate(listaDespiecesDetalles, {
      validate: true, // Opcional: valida cada instancia antes de insertarla
    });
  }

  async actualizarDespieceDetalleCotizacion(
    cotizacion_id,
    nuevo_despiece_detalles,
    transaction = null
  ) {
    const cotizacion = await Cotizacion.findByPk(cotizacion_id, {
      include: [{ model: db.despieces }],
      transaction,
    });
    if (!cotizacion) {
      throw new Error("Cotización no encontrada");
    }
    //*Eliminamos el despiece detalles
    await DespieceDetalle.destroy({
      where: { despiece_id: cotizacion.despiece_id },
      transaction,
    });
    let piezas_creadas = [];
    for (const newPiece of nuevo_despiece_detalles) {
      console.log(cotizacion.despiece_id);
      
      const payload = {
        despiece_id: cotizacion.despiece_id,
        pieza_id: newPiece.pieza_id,
        cantidad: newPiece.cantidad,
        peso_kg: 0,
        precio_venta_dolares:0,
        precio_venta_soles:0,
        precio_alquiler_soles:0,
      };
      console.log(newPiece);
      
      const pieza = await Pieza.findByPk(newPiece.pieza_id,{transaction});
      if (!pieza) {
        throw new Error("Error al obtener una nueva pieza");
      }
      payload.peso_kg = Number(newPiece.cantidad) * pieza.peso_kg;
      payload.precio_venta_dolares =
        Number(newPiece.cantidad) * pieza.precio_venta_dolares;
      payload.precio_venta_soles =
        Number(newPiece.cantidad) * pieza.precio_venta_soles;
      payload.precio_alquiler_soles =
        Number(newPiece.cantidad) * pieza.precio_alquiler_soles;
      const pieza_creada = await DespieceDetalle.create(payload,{transaction});
      if (!pieza_creada) {
        throw new Error("Error al crear una nueva pieza_detalle");
      }
      piezas_creadas.push(pieza_creada);
    }

    return piezas_creadas;
  }
  
  
  async actulizarPiezas(idDespiece, lista_piezas) {
    const transacción = await db.sequelize.transaction();
    try {
      // ? 1 Consulta piezas actuales (dentro de la transacción)
      const piezasActuales = await DespieceDetalle.findAll({
        where: { despiece_id: idDespiece },
        transaction: transacción
      });

      // ? 2 Borra TODAS las piezas anteriores
      await DespieceDetalle.destroy({
        where: { despiece_id: idDespiece },
        transaction: transacción
      });

      // ? 3 Inserta las nuevas piezas UNA A UNA
      const piezasNuevas = [];
      for (const pieza of lista_piezas) {
        const nuevaPieza = await DespieceDetalle.create(
          { ...pieza, despiece_id: idDespiece },
          { transaction: transacción }
        );
        piezasNuevas.push(nuevaPieza);
      }

      // ? 4 Confirma la transacción (commit)
      await transacción.commit();

      return {
        success: true,
        mensaje: "Piezas actualizadas exitosamente",
        data: { anteriores: piezasActuales, nuevas: piezasNuevas },
      };

    } catch (error) {
      await transacción.rollback();
      return {
        success: false,
        mensaje: "Error al actualizar las piezas",
        error,
      };
    }
  }


}

module.exports = sequelizeDespieceDetalleRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
