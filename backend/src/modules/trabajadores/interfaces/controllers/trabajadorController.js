const crearTrabajador = require("../../application/useCases/crearTrabajador");
const SequelizeTrabajadorRepository = require("../../infraestructure/repositories/sequelizeTrabajadorRepository");

const trabajadorRepository = new SequelizeTrabajadorRepository();

const TrabajadorController = {
   async crearTrabajador(req, res) {
      try {
         const nuevoTrabajador = await crearTrabajador(
            req.body,
            trabajadorRepository
         );
         res.status(nuevoTrabajador.codigo).json(nuevoTrabajador.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports=TrabajadorController