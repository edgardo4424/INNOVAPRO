const { ReciboPorHonorario } = require("../models/reciboModel");

class SequelizeReciboPorHonorariosRepository {

    async crearReciboPorHonorarios(payload, transaction = null) {
      const options = {};
      if (transaction) options.transaction = transaction;
  
      await ReciboPorHonorario.create(payload, options);
    }
    async editarReciboPorHonorarios(payload, transaction = null) {
      const options = {
        where:{
          id:payload.recibo_id
        }
      };
      if (transaction) options.transaction = transaction;
  
      await ReciboPorHonorario.update(payload, options);
    }
    

}

module.exports = SequelizeReciboPorHonorariosRepository; // Exporta la clase para que pueda ser utilizada en otros módulos