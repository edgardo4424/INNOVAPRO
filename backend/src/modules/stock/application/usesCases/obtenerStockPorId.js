module.exports = async (id, stockRepository) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: "EL ID no fue enviado",
      };
   }
   const stock =await stockRepository.obtenerStockPorId(id);   
   return {
      codigo: 200,
      respuesta:stock,
   };
};
