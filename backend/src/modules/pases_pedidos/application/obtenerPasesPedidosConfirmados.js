module.exports = async (pasePedidoRepository, transaction = null) => {
  const pases_pedidos =
    await pasePedidoRepository.obtenerPasesPedidosConfirmados(transaction);
  return {
    codigo: 202,
    respuesta: {
      mensaje:"Pases de pedido obtenidos correctamente",
      pases_pedidos,
    },
  };
};
