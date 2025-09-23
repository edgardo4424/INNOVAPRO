const crearVacaciones = require("../../application/useCases/crearVacaciones");
const obtenerVacacionesTrabajadores = require("../../application/useCases/obtenerVacacionesTrabajadores");
const SequelizeVacacionesRepository = require("../../infraestructure/repositories/sequelizeVacacionesRepository");
const sequelize = require("../../../.././config/db");

const vacacionesRepository = new SequelizeVacacionesRepository();

const VacacionesController = {
   async crearVacaciones(req, res) {
      const transaction = await sequelize.transaction();
      try {
         const nuevasVacaciones = await crearVacaciones(
            req.body,
            vacacionesRepository,
            transaction
         );
         await transaction.commit();
         res.status(nuevasVacaciones.codigo).json(nuevasVacaciones.respuesta);
      } catch (error) {
         console.log('Hub un error al crear las vacacciones');
         console.log("----vvvvv");
         console.log(error);
         console.log("###########");
         await transaction.rollback();
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
