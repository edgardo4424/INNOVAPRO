const sequelize = require("../../../../config/db");
const { Stock } = require("../models/stockModel");
const { MovimientoStock } = require("../models/movimientoStockModel");
const {
  Cotizacion,
} = require("../../../cotizaciones/infrastructure/models/cotizacionModel");
const db = require("../../../../database/models");
const { getFechaHoraLima } = require("../../../../shared/utils/fechaLima");
const {
  PasePedido,
} = require("../../../pases_pedidos/infraestructure/models/pasePedidoModel");
const sumarPiezas = require("../../../pases_pedidos/infraestructure/utils/sumar_piezas");
const {
  DespieceDetalle,
} = require("../../../despieces_detalles/infrastructure/models/despieceDetalleModel");
const { Pieza } = require("../../../piezas/infrastructure/models/piezaModel");
const query = `SELECT 
  p.id AS pieza_id,
  p.item,
  p.descripcion,
  s.stock_fijo,
  s.stock_disponible,
  SUM(CASE WHEN ec.nombre = 'Por aprobar' THEN dd.cantidad ELSE 0 END) AS 'Por aprobar'
FROM piezas p
LEFT JOIN stock s ON p.id = s.pieza_id
LEFT JOIN despieces_detalle dd ON p.id = dd.pieza_id
LEFT JOIN despieces d ON d.id = dd.despiece_id
LEFT JOIN cotizaciones c ON c.despiece_id = d.id
LEFT JOIN estados_cotizacion ec ON ec.id = c.estados_cotizacion_id
GROUP BY p.id, p.item, p.descripcion, s.stock_disponible;
`;

class SequelizeStockRepository {
  // prettier-ignore
  async obtenerStockPiezasPorEstado() {
    const piezas = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    return piezas;
  }

  // prettier-ignore
  async obtenerStockPorId(piezaId) {
    return await Stock.findOne({
      where: {
        pieza_id: piezaId,
      },
    });
  }

  // prettier-ignore
  async crear(stockData) {
    const t = await sequelize.transaction();
    try {
      const stock = await Stock.create(stockData, { transaction: t });
      await MovimientoStock.create(
        {
          stock_id: stock.id,
          tipo: "Ingreso",
          cantidad: stock.stock_fijo,
          stock_pre_movimiento: 0,
          stock_post_movimiento: stock.stock_fijo,
          tipo_stock: "fijo",
          motivo: "Primer ingreso de stock para la pieza",
          fecha: new Date(),
        },
        { transaction: t }
      );
      await MovimientoStock.create(
        {
          stock_id: stock.id,
          tipo: "Ajuste ingreso",
          cantidad: stock.stock_disponible,
          stock_pre_movimiento: 0,
          stock_post_movimiento: stock.stock_disponible,
          tipo_stock: "disponible",
          motivo: "Primer ingreso de stock para la pieza",
          fecha: new Date(),
        },
        { transaction: t }
      );
      await t.commit();
      return stock;
    } catch (error) {
      await t.rollback();
      throw new Error(error.message);
    }
  }

  // *tipos de movimiento stock disponible: Alquiler, Devolucion, Ajuste ingreso, Ajuste salida
  // prettier-ignore
  async actualizarStockDisponible(piezaId, cantidad, tipoMovimiento, motivo,transaction=null) {

      const stock = await Stock.findOne({
        where: { pieza_id: piezaId },
        transaction,
      });
      if (!stock) {
        throw new Error("Stock no encontrado");
      }
      const stockPre = stock.stock_disponible;

      if (
        tipoMovimiento === "Devolucion" ||
        tipoMovimiento === "Ajuste ingreso"
      ) {
        stock.stock_disponible += cantidad;
      } else if (
        tipoMovimiento === "Alquiler" ||
        tipoMovimiento === "Ajuste salida"
      ) {
        stock.stock_disponible -= cantidad;
      } else {
        throw new Error("Tipo de operación Inválida");
      }
      if (stock.stock_disponible < 0) {
        throw new Error("El stock disponible no puede ser negativo");
      }
      await stock.save({ transaction });

      const stockPost = stock.stock_disponible;
     const move= await MovimientoStock.create(
        {
          stock_id: stock.id,
          tipo: tipoMovimiento,
          cantidad: cantidad,
          stock_pre_movimiento: stockPre,
          stock_post_movimiento: stockPost,
          tipo_stock: "Disponible",
          motivo: motivo || null,
          fecha: getFechaHoraLima(),
        },
        { transaction}
      );      
  }

  // *Tipos de movimiento stock fijo: Ingreso, Baja, Venta, Ingreso reparacion, Ingreso salida
  // prettier-ignore
  async actualizarStockFijo(piezaId, cantidad, tipoMovimientoFijo, motivo,t=null) {

      const stock = await Stock.findOne({
        where: { pieza_id: piezaId },
        transaction: t,
      });
      if (!stock) {
        throw new Error("Stock no encontrado");
      }

      const stockFijoPre = stock.stock_fijo;
      const stockDisponiblePre = stock.stock_disponible;

      // Determinar si es ingreso o salida
      let esIngreso = false;
      if (
        tipoMovimientoFijo === "Ingreso" ||
        tipoMovimientoFijo === "Ingreso-reparacion"
      ) {
        esIngreso = true;
        stock.stock_fijo += cantidad;
        stock.stock_disponible += cantidad;
      } else if (
        tipoMovimientoFijo === "Baja" ||
        tipoMovimientoFijo === "Venta" ||
        tipoMovimientoFijo === "Salida-reparacion"
      ) {
        esIngreso = false;
        stock.stock_fijo -= cantidad;
        stock.stock_disponible -= cantidad;
      } else {
        throw new Error("Tipo de operación FIJO inválida");
      }

      // Evitar stock negativo
      if (stock.stock_fijo < 0) {
        throw new Error("El stock fijo no puede ser negativo");
      }
      if (stock.stock_disponible < 0) {
        throw new Error("El stock disponible no puede ser negativo");
      }

      // Guardar cambios
      await stock.save({ transaction: t });

      const stockFijoPost = stock.stock_fijo;
      const stockDisponiblePost = stock.stock_disponible;

      // Determinar tipo de movimiento para disponible
      const tipoMovimientoDisponible = esIngreso
        ? "Ajuste ingreso"
        : "Ajuste salida";

      // Crear movimiento para stock fijo
      const move_fijo=await MovimientoStock.create(
        {
          stock_id: stock.id,
          tipo: tipoMovimientoFijo,
          cantidad: cantidad,
          stock_pre_movimiento: stockFijoPre,
          stock_post_movimiento: stockFijoPost,
          tipo_stock: "fijo",
          motivo: motivo || null,
          fecha: new Date(),
        },
        { transaction: t }
      );

      // Crear movimiento para stock disponible
      const move_disp=await MovimientoStock.create(
        {
          stock_id: stock.id,
          tipo: tipoMovimientoDisponible,
          cantidad: cantidad,
          stock_pre_movimiento: stockDisponiblePre,
          stock_post_movimiento: stockDisponiblePost,
          tipo_stock: "disponible",
          motivo: motivo || null,
          fecha: new Date(),
        },
        { transaction: t }
      );
      // console.log("MOVIMIENTO DE LA PIEZA CON ID",piezaId);
      // console.log("Movimeinto fijo",move_fijo.get({plain:true}));
      // console.log("Movimeinto disponible",move_disp.get({plain:true}));
      // console.log("Stock",stock.get({plain:true}));
      
      
  }

  async verificarStockDisponible(cotizacion_id, transaction = null) {
    const cotizacion = await Cotizacion.findByPk(cotizacion_id, {
      transaction,
    });
    const DESPIECE_ID_COTIZACION = cotizacion.despiece_id;
    const DESPIECE_DETALLE_COTIZACION = await DespieceDetalle.findAll({
      where: { despiece_id: DESPIECE_ID_COTIZACION },
    });
    // const DESPIECE_DETALLE_COTIZACION=RESPONSE_DESPIECE_DETALLE_COTIZACION.map((d)=>d.get({plain:true})

    const responsePasesPedido = await PasePedido.findAll({
      where: { estado: "Stock Confirmado" },
      include: [
        {
          model: db.contratos,
          as: "contrato",
          include: [
            {
              model: db.despieces,
              as: "despiece",
              include: [
                {
                  model: db.despieces_detalle,
                },
              ],
            },
          ],
        },
      ],
    });
    let agrupacion_despieces = [];
    for (const pp of responsePasesPedido) {
      const despieces = pp.get({ plain: true }).contrato.despiece
        .despieces_detalles;
      agrupacion_despieces.push(despieces);
    }
    agrupacion_despieces.push(DESPIECE_DETALLE_COTIZACION);
    const SUMATORIA_DESPIECES = sumarPiezas(agrupacion_despieces);

    let id_piezas_sin_stock = [];
    for (const despiece_detalle of SUMATORIA_DESPIECES) {
      const cantidad_requerida_pieza = despiece_detalle.cantidad;
      const pieza = await Pieza.findByPk(despiece_detalle.pieza_id, {
        include: [{ model: db.stock, as: "stock" }],
      });
      // console.log("*****");
      // console.log("PIEZA ID: ", despiece_detalle.pieza_id);
      // console.log("Cantidad requerida: ", cantidad_requerida_pieza);
      // console.log(
      //   "Stock disponible de la pieza con ID:",
      //   pieza.id,
      //   "- cantidad: ",
      //   pieza.stock.stock_disponible
      // );
      // console.log("*****");

      if (cantidad_requerida_pieza > pieza.stock.stock_disponible) {
        id_piezas_sin_stock.push(pieza.id);
      }
    }

    console.log("PIEZAS SIN SOTCK", id_piezas_sin_stock);

    let piezas_verificadas = [];
    let estado = true;
    for (const dp of DESPIECE_DETALLE_COTIZACION) {
      const payload = {
        despiece_id: dp.id,
        pieza_id: dp.pieza_id,
        item: dp.item,
        descripcion: dp.descripcion,
        cantidad: dp.cantidad,
        peso_kg: dp.peso_kg,
        precio_venta_dolares: dp.precio_venta_dolares,
        precio_venta_soles: dp.precio_venta_soles,
        precio_alquiler_soles: dp.precio_alquiler_soles,
        esAdicional: dp.esAdicional,
        // pieza_stock_actual: dp.pieza.stock.stock_disponible,
        estado: !id_piezas_sin_stock.includes(dp.pieza_id),
        text: id_piezas_sin_stock.includes(dp.pieza_id)
          ? "Piezas insuficientes"
          : "Hay piezas disponibles",
      };      
      if (id_piezas_sin_stock.includes(dp.pieza_id)) {
        estado = false;
      }
      piezas_verificadas.push(payload);
    }
    return {
      piezas: piezas_verificadas,
      estado,
    };
  }
}

module.exports = SequelizeStockRepository;
