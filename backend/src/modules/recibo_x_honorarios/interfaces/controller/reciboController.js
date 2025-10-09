const sequelize = require("../../../.././config/db");
const actualizarReciboPlanilla = require("../../application/useCases/actualizarReciboPlanilla");
const crearReciboPlanilla = require("../../application/useCases/crearReciboPlanilla");
const SequelizeReciboPorHonorariosRepository = require("../../infraestructure/repositories/SequelizeReciboPorHonorariosRepository");

const reciboRepository = new SequelizeReciboPorHonorariosRepository();

const ReciboController = {
  async crearRecibosPlanilla(req, res) {
    const transaction = await sequelize.transaction();
    const recibo = req.body;    
    try {
      const response = await crearReciboPlanilla(recibo,reciboRepository, transaction);
      await transaction.commit();
      res.status(response.codigo).json(response.respuesta);
    } catch (error) {
      console.log("El error es: ",error);
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
  async actualizarRecibosPlanilla(req, res) {
    const transaction = await sequelize.transaction();
    const recibo = req.body;    
    try {
      const response = await actualizarReciboPlanilla(recibo,reciboRepository, transaction);
      await transaction.commit();
      res.status(response.codigo).json(response.respuesta);
    } catch (error) {
      console.log("El error es: ",error);
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ReciboController;
