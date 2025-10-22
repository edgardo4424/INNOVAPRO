module.exports = async (cotizacion_id, stockRepository, transaction = null) => {

  const verificacion_piezas = await stockRepository.verificarStockDisponible(
    cotizacion_id,
    transaction
  );
  
  return {
    codigo: 200,
    respuesta: verificacion_piezas,
  };
};
