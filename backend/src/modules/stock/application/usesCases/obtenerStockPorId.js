module.exports = async (piezaId, stockRepository) => {
   if (!piezaId) {
      return {
         codigo: 400,
         respuesta: "EL ID no fue enviado",
      };
   }
   const stock =await stockRepository.obtenerStockPorId(piezaId);   
   return {
      codigo: 200,
      respuesta:stock,
   };
};
