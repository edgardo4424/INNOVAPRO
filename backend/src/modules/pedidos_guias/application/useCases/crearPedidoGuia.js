module.exports = async (payload, pedidoGuiaRepository, transaction = null) => {
  const pedido_guia = await pedidoGuiaRepository.crearPedidoGuia(
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
