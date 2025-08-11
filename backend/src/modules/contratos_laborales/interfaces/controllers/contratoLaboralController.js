const crearContratoLaboral = require("../../application/useCases/crearContratoLaboral");
const SequelizeContratoLaboralRepository = require("../../infraestructure/repositories/sequelizeContratoLaboralRepository");

const contratoLaboralRepository = new SequelizeContratoLaboralRepository();
const ContratoLaboralController = {
   async crearContratoLaboral(req, res) {
      try {
         const nuevoContratoLaboral = await crearContratoLaboral(
            req.body,
            contratoLaboralRepository
         );
         res.status(nuevoContratoLaboral.codigo).json(
            nuevoContratoLaboral.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = ContratoLaboralController;
