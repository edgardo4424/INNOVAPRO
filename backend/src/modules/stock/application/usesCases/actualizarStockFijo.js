module.exports = async (nuevoStockData, stockRepository,t=null) => {
    
   const { piezaId, cantidad, tipoMovimiento, motivo } = nuevoStockData;
   if (!piezaId || !cantidad || !tipoMovimiento) {
      return {
         codigo: 400,
         respuesta: { mensaje: "Datos incompletos para la operación" },
      };
   }

   await stockRepository.actualizarStockFijo(
      piezaId,
      cantidad,
      tipoMovimiento,
      motivo,
      t
   );

   return {
      codigo: 201,
      respuesta: { mensaje: "El Stock se actualizó correctamente" },
   };
};
