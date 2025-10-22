module.exports = async (cotizacion_id, stockRepository, transaction = null) => {
            console.log("entrodasdasdsadsadasd");

  const verificacion_piezas = await stockRepository.verificarStockDisponible(
    cotizacion_id,
    transaction
  );
  console.log(verificacion_piezas);
  
  return {
    codigo: 200,
    respuesta: verificacion_piezas,
  };
};
