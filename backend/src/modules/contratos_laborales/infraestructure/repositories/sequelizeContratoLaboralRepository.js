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
}

module.exports = SequelizeContratoLaboralRepository;
