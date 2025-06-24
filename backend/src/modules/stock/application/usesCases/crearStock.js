const Stock = require("../../domain/entities/stock");

module.exports = async (stockData, stockRepository) => {
   const nuevoStock = new Stock(stockData);
   if (!nuevoStock.isValid()) {
      return { codigo: 400, respuesta: { mensaje: nuevoStock.getErrors() } };
   }
   await stockRepository.crear(stockData);
   return {
      codigo: 201,
      respuesta: { mensaje: "El stock fue creado exitosamente" },
   };
};
