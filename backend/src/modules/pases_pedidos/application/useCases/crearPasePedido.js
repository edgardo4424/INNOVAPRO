
module.exports = async (pasePedidoRepository, contrato_id, transaction = null) => {

  if (!contrato_id) {
    return {
      codigo: 403,
      respuesta: {
        mensaje:"Los datos enviados son incorrectos."
      },
    };
  }
  const response_pase_pedido = await pasePedidoRepository.crearPasePedido(
    contrato_id,
    transaction
  );

  return {
    codigo: 202,
    respuesta: {
      mensaje: "Pase de pedido creado correctamente",
      pase_pedido: response_pase_pedido,
    },
  };
};
