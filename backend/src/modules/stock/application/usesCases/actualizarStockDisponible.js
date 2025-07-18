module.exports = async (nuevoStockData, stockRepository) => {
    console.log('Se entro al caso de uso');
    
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
      motivo
   );

   return {
      codigo: 201,
      respuesta: { mensaje: "El Stock se actualizó correctamente" },
   };
};
