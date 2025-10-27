const PasePedido = require("../../domain/entities/pasePedido");

module.exports = async (pasePedidoRepository, payload, transaction = null) => {
  const pase_pedido = new PasePedido(payload);
  const errores = pase_pedido.validarCamposObligatorios();
  if (errores.length > 0) {
    return {
      codigo: 403,
      respuesta: {
        errores,
      },
    };
  }
  const response_pase_pedido = await pasePedidoRepository.crearPasePedido(
    pase_pedido.get(),
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
