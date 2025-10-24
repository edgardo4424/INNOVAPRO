module.exports = async (payload, pedidoGuiaRepository, transaction = null) => {
  const pase_pedido = await pedidoGuiaRepository.crearPedidoGuia(
    payload,
    transaction
  );
  return {
    codigo: 200,
    respuesta: {
      pase_pedido,
    },
  };
};
