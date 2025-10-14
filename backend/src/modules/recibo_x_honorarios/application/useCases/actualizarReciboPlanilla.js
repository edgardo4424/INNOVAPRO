const ReciboPorHonorario = require("../../domain/reciboPorHonorario");

module.exports = async (payload, reciboRepository, transaction = null) => {
  const recibo = new ReciboPorHonorario(payload);
  const errores = recibo.validarCamposObligatorios(true);
  if (errores.length > 0) {
    throw new Error(errores);
  }
  const construccion_datos = recibo.construirDatos(true);

    await reciboRepository.actualizarReciboPorHonorarios(
      construccion_datos,
      transaction
    );

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Recibo  actualizado exitosamente",
    },
  };
};
