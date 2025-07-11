const crearTrabajador = require("../../application/useCases/crearTrabajador");
const obtenerTrabajadoresPorFilial = require("../../application/useCases/obtenerTrabajadoresPorFilial");
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
   async obtenerTrabajadoresPorFilial(req, res) {
      try {
         const trabajadores = await obtenerTrabajadoresPorFilial(req.params.id,trabajadorRepository);
         res.status(trabajadores.codigo).json(trabajadores.respuesta)
      } catch (error) {}
   },
};

module.exports = TrabajadorController;
