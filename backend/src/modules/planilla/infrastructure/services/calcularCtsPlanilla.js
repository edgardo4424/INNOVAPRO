const SequelizeCtsRopository = require("../../../cts/infraestructure/repositories/sequelizeCtsRepository");

const ctsRepository = new SequelizeCtsRopository();

const calcularCTSPlanilla = async (periodo, anio, filial_id, trabajador_id,transaction) => {
   if (periodo) {
      const responseCts = await ctsRepository.obtenerCtsPorTrabajador(
         periodo,
         anio,
         filial_id,
         trabajador_id,
         transaction
      );      
      if (responseCts) {
         return Number(responseCts.cts_depositar);
      }
      return 0;
   }
   return 0;
};

module.exports = calcularCTSPlanilla;
