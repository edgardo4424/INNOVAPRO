module.exports = async (
  pedido_guia_id,
  payload,
  pedidoGuiaRepository,
  transaction = null
) => {
  const pedido_guia = await pedidoGuiaRepository.actualizarPedidoGuia(
    pedido_guia_id,
    payload,
    transaction
  );  
  return {
    codigo: 200,
    respuesta: {
      pedido_guia,
    },
  };
};
