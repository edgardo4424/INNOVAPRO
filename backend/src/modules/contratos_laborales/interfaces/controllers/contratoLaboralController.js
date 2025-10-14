const crearContratoLaboral = require("../../application/useCases/crearContratoLaboral");
const editarContratoLaboral = require("../../application/useCases/editarContratoLaboral");
const eliminarContratoLaboralPorId = require("../../application/useCases/eliminarContratoLaboralPorId");
const obtenerContratosPorTrabajadorId = require("../../application/useCases/obtenerContratosPorTrabajadorId");
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
   async editarContratoLaboral(req, res) {
      try {
         const contratoLaboralActualizado = await editarContratoLaboral(
            req.body,
            contratoLaboralRepository
         );
         res.status(contratoLaboralActualizado.codigo).json(
            contratoLaboralActualizado.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async eliminarContratoLaboralPorId(req, res) {
      try {
         const contratoEliminado = await eliminarContratoLaboralPorId(
            req.params.id,
            contratoLaboralRepository
         );
         res.status(contratoEliminado.codigo).json(contratoEliminado.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerContratosPorTrabajadorId(req, res) {
      try {
         const contratos = await obtenerContratosPorTrabajadorId(
            req.params.id,
            contratoLaboralRepository
         );
         res.status(contratos.codigo).json(contratos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = ContratoLaboralController;
