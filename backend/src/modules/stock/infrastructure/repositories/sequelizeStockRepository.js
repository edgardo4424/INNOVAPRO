const { where } = require("sequelize");
const sequelize = require("../../../../config/db");
const { Stock } = require("../models/sotckModel");
const { MovimientoStock } = require("../models/movimientoStockModel");

const query = `SELECT 
  p.id AS pieza_id,
  p.item,
  p.descripcion,
  p.stock_actual,
  SUM(CASE WHEN ec.nombre = 'En proceso' THEN dd.cantidad ELSE 0 END) AS 'En proceso',
  SUM(CASE WHEN ec.nombre = 'Despiece generado' THEN dd.cantidad ELSE 0 END) AS 'Despiece generado',
  SUM(CASE WHEN ec.nombre = 'Por aprobar' THEN dd.cantidad ELSE 0 END) AS 'Por aprobar'
FROM piezas p
LEFT JOIN despieces_detalle dd ON p.id = dd.pieza_id
LEFT JOIN despieces d ON d.id = dd.despiece_id
LEFT JOIN cotizaciones c ON c.despiece_id = d.id
LEFT JOIN estados_cotizacion ec ON ec.id = c.estados_cotizacion_id
GROUP BY p.id;;
`;

class SequelizeStockRepository {
   async obtenerStockPiezasPorEstado() {
      const piezas = await sequelize.query(query, {
         type: sequelize.QueryTypes.SELECT,
      });
      return piezas;
   }

   async crear(stockData) {
      return await Stock.create(stockData);
   }
   async obtenerStockPorId(piezaId) {
      return await Stock.findOne({
         where: {
            pieza_id: piezaId,
         },
      });
   }

   async actualizarStockDisponible(piezaId, cantidad, tipoMovimiento, motivo) {
      const t = await sequelize.transaction();

      try {
         const stock = await Stock.findOne({
            where: { pieza_id: piezaId },
            transaction: t,
         });
         // console.log(stock);

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
         await stock.save({ transaction: t });

         const stockPost = stock.stock_disponible;
         await MovimientoStock.create(
            {
               stock_id: stock.id,
               tipo: tipoMovimiento,
               cantidad: cantidad,
               stock_pre_movimiento: stockPre,
               stock_post_movimiento: stockPost,
               tipo_stock: "Disponible",
               motivo: motivo || null,
               fecha: new Date(),
            },
            { transaction: t }
         );
         await t.commit();
      } catch (error) {
         await t.rollback();
         throw new Error(error.message);
      }
   }

   async actualizarStockFijo(piezaId, cantidad, tipoMovimientoFijo, motivo) {
      const t = await sequelize.transaction();

      try {
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
            tipoMovimientoFijo === "Ingreso reparacion"
         ) {
            esIngreso = true;
            stock.stock_fijo += cantidad;
            stock.stock_disponible += cantidad;
         } else if (
            tipoMovimientoFijo === "Baja" ||
            tipoMovimientoFijo === "Venta" ||
            tipoMovimientoFijo === "Salida reparacion"
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
            ? "Ajuste Ingreso"
            : "Ajuste salida";

         // Crear movimiento para stock fijo
         await MovimientoStock.create(
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
         await MovimientoStock.create(
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
         await t.commit();
      } catch (error) {
         await t.rollback();
         throw new Error(error.message);
      }
   }
}

module.exports = SequelizeStockRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
