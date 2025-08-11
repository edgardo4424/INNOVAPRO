const obtenerTrabajadores = require("../../application/useCases/obtenerTrabajadores");
const crearTrabajador = require("../../application/useCases/crearTrabajador");
const obtenerTrabajadoresPorArea = require("../../application/useCases/obtenerTrabajadoresPorArea");
const SequelizeTrabajadorRepository = require("../../infraestructure/repositories/sequelizeTrabajadorRepository");
const crearTrabajadorConContrato = require("../../../../application/services/crearTrabajadorConContrato");

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
   async crearTrabajadorConContrato(req, res) {
      try {
         const nuevaContratacion = await crearTrabajadorConContrato(req.body);
         res.status(nuevaContratacion.codigo).json(nuevaContratacion.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerTrabajadoresPorArea(req, res) {
      try {
         const trabajadores = await obtenerTrabajadoresPorArea(
            req.params.id,
            req.params.fecha,
            trabajadorRepository
         );
         res.status(trabajadores.codigo).json(trabajadores.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerTrabajadores(req, res) {
      try {
         const trabajadores = await obtenerTrabajadores(trabajadorRepository);
         res.status(trabajadores.codigo).json(
            trabajadores.respuesta.trabajadores
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = TrabajadorController;
