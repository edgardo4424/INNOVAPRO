module.exports = async (
  payload,
  stockPedidoPiezaRepository,
  transaction = null
) => {
  const { pieza_id, pase_pedido_id, tipo_movimiento, cantidad } = payload;
  if(!pieza_id||!pase_pedido_id||!tipo_movimiento||!cantidad){
    return{
        codigo:400,
        respuesta:{
            mensaje:"Datos para la operacion incompletos"
        }
    }
  }

    await stockPedidoPiezaRepository.actualizarStockPedidoPieza(
      pieza_id,
      pase_pedido_id,
      tipo_movimiento,
      cantidad,
      transaction
    );

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Stock del pedido pieza actualizado correctamente",
    },
  };
};
