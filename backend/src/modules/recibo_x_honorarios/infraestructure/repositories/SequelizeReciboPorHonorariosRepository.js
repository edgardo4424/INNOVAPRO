const {
  PlanillaMensualReciboHonorario,
} = require("../../../planilla/infrastructure/models/PlanillaRecibosHonorarios");
const { ReciboPorHonorario } = require("../models/reciboModel");

class SequelizeReciboPorHonorariosRepository {
  async crearReciboPorHonorarios(payload, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    const recibo=await ReciboPorHonorario.create(payload, options);
    return recibo;
  }
  async actualizarReciboPorHonorarios(payload, transaction = null) {
    const options = {
      where: {
        id: payload.recibo_id,
      },
    };
    if (transaction) options.transaction = transaction;

    await ReciboPorHonorario.update(payload, options);
  }
  async unirReciboPlanilla(payload, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    await PlanillaMensualReciboHonorario.create(payload, options);
  }
}

module.exports = SequelizeReciboPorHonorariosRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
