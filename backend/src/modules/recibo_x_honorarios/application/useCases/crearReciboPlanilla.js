const ReciboPorHonorario = require("../../domain/reciboPorHonorario");

module.exports = async (payload, reciboRepository, transaction = null) => {    
    const recibo = new ReciboPorHonorario(payload);
    const errores = recibo.validarCamposObligatorios();
    if (errores.length > 0) {
      throw new Error(errores);
    }
    const construccion_datos = recibo.construirDatos();
    console.log("Datos contruidos: ",construccion_datos);
    
    const recibo_creado = await reciboRepository.crearReciboPorHonorarios(
      construccion_datos,
      transaction
    );
    console.log("Recibo creado: ",recibo_creado);
    
    // Unir los recibos con la planilla
    const union = {
      planilla_mensual_id: payload.planilla_id,
      recibo_por_honorarios_id: recibo_creado.id,
    };
    await reciboRepository.unirReciboPlanilla(union, transaction);

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Recibo  creado exitosamente",
      recibo: "Recibo dx",
    },
  };
};
