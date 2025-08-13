const { ContratoLaboral } = require("../models/contratoLaboralModel");

class SequelizeContratoLaboralRepository {
   async crear(contratoLaboralData, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const contratoLaboral = await ContratoLaboral.create(
         contratoLaboralData,
         options
      );
      return contratoLaboral;
   }
   async editarContratoLaboral(contratoLaboralData, transaction = null) {
      const options = { where: { id: contratoLaboralData.contrato_id } };
      if (transaction) {
         options.transaction = transaction;
      }
      console.log(contratoLaboralData);

      const contratoLaboral = await ContratoLaboral.update(
         contratoLaboralData,
         options
      );
      return contratoLaboral;
   }
   async obtenerContratosPorTrabajadorId(id, transaction = null) {
      const options = {
         where: {
            trabajador_id: id,
            estado: 1,
         },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const contratos = await ContratoLaboral.findAll(options);
      return contratos;
   }
   async eliminarContratoPorId(id, transaction = null) {
      const options = {
         where: { id },
      };
      if (transaction) options.transaction = transaction;
      await ContratoLaboral.update({ estado: 0 }, options);
   }
}

module.exports = SequelizeContratoLaboralRepository;
