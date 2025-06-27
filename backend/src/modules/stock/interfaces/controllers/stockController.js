const sequelizeStockRepository = require("../../infrastructure/repositories/sequelizeStockRepository"); 

const stockRepository = new sequelizeStockRepository(); 

const obtenerStockPiezasPorEstado = require("../../application/usesCases/obtenerStockPiezasPorEstado");
const crearStock = require("../../application/usesCases/crearStock");
const obtenerStockPorId = require("../../application/usesCases/obtenerStockPorId");
const actualizarStockDisponible = require("../../application/usesCases/actualizarStockDisponible");
const actualizarStockFijo = require("../../application/usesCases/actualizarStockFijo");

const StockController = {
   async obtenerStockPiezasPorEstado(req, res) {
      try {
         const stockPiezas = await obtenerStockPiezasPorEstado(stockRepository); 
         res.status(stockPiezas.codigo).json({ piezas: stockPiezas.respuesta || [] }); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },
   async crearStock(req, res) {
      try {
         const nuevoStock = await crearStock(req.body, stockRepository);
         res.status(nuevoStock.codigo).json(nuevoStock.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerStockPorId(req, res) {
      try {
         const stock = await obtenerStockPorId(req.params.id, stockRepository);
         res.status(stock.codigo).json({ stock: stock.respuesta });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async actualizarStockDisponible(req, res) {
      try {
         const stockActualizado = await actualizarStockDisponible(
            req.body,
            stockRepository
         );
         res.status(stockActualizado.codigo).json({
            stock: stockActualizado.respuesta,
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },

   async actualizarStockFijo(req, res) {
      try {
         const stockActualizado = await actualizarStockFijo(
            req.body,
            stockRepository
         );
         res.status(stockActualizado.codigo).json({
            stock: stockActualizado.respuesta,
         });
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = StockController; // Exportamos el controlador de usuarios
