module.exports = async (nuevoStockData, stockRepository,transaction=null) => {
    
   const { piezaId, cantidad, tipoMovimiento, motivo } = nuevoStockData;
   if (!piezaId || !cantidad || !tipoMovimiento) {
      return {
         codigo: 400,
         respuesta: { mensaje: "Datos incompletos para la operación" },
      };
   }

   await stockRepository.actualizarStockDisponible(
      piezaId,
      cantidad,
      tipoMovimiento,
      motivo,
      transaction
   );

   return {
      codigo: 201,
      respuesta: { mensaje: "El Stock se actualizó correctamente" },
   };
};
