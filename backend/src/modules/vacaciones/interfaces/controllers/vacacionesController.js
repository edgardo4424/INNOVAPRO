const crearVacaciones = require("../../application/useCases/crearVacaciones");
const obtenerVacacionesTrabajadores = require("../../application/useCases/obtenerVacacionesTrabajadores");
const SequelizeVacacionesRepository = require("../../infraestructure/repositories/sequelizeVacacionesRepository");

const vacacionesRepository = new SequelizeVacacionesRepository();

const VacacionesController = {
   async crearVacaciones(req, res) {
      try {
         const nuevasVacaciones = await crearVacaciones(
            req.body,
            vacacionesRepository
         );
         res.status(nuevasVacaciones.codigo).json(nuevasVacaciones.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },

   async obtenerVacacionesTrabajadores(req, res) {
      try {
         const trabajadoresXvacaciones = await obtenerVacacionesTrabajadores(
            vacacionesRepository
         );
         res.status(trabajadoresXvacaciones.codigo).json(
            trabajadoresXvacaciones.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};
module.exports = VacacionesController;
