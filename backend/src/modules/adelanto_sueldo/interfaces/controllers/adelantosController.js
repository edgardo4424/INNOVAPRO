const crearAdelantoSueldo = require("../../application/useCases/crearAdelantoSueldo");
const editarAdelantoSueldo = require("../../application/useCases/editarAdelantoSueldo");
const eliminarAdelantoSueldoPorId = require("../../application/useCases/eliminarAdelantoSueldoPorId");
const obtenerAdelantos = require("../../application/useCases/obtenerAdelantos");
const obtenerAdelantosDelTrabajadorEnRango = require("../../application/useCases/obtenerAdelantosDelTrabajadorEnRango");
const obtenerAdelantosPorTrabajadorId = require("../../application/useCases/obtenerAdelantosPorTrabajadorId");
const SequelizeAdelantoSueldoRepository = require("../../infraestructure/repositories/sequlizeAdelantoSueldoRepository");

const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

const SequelizeContratoLaboralRepository = require("../../../contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");

const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

const AdelantoSueldoController = {
   async crearAdelantoSueldo(req, res) {
      try {
         const nuevo_adelanto_sueldo = await crearAdelantoSueldo(
            req.body,
            adelantoSueldoRepository,
            contratoLaboralRepository
         );

         res.status(nuevo_adelanto_sueldo.codigo).json(
            nuevo_adelanto_sueldo.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },

   async editarAdelantoSueldo(req, res) {
      try {
         const adelanto_sueldo_editado = await editarAdelantoSueldo(
            req.body,
            adelantoSueldoRepository
         );
         res.status(adelanto_sueldo_editado.codigo).json(
            adelanto_sueldo_editado.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerAdelantos(req, res) {
      try {
         const adelantos = await obtenerAdelantos(adelantoSueldoRepository);
         res.status(adelantos.codigo).json(adelantos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerAdelantosDelTrabajadorEnRango(req, res) {
      try {
         const adelantos = await obtenerAdelantosDelTrabajadorEnRango(
            req.body,
            adelantoSueldoRepository
         );
         res.status(adelantos.codigo).json(adelantos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerAdelantosPorTrabajadorId(req, res) {
      try {
         const adelantos = await obtenerAdelantosPorTrabajadorId(
            req.params.id,
            adelantoSueldoRepository
         );
         res.status(adelantos.codigo).json(adelantos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async eliminarAdelantoSueldoPorId(req, res) {
      try {
         const adelanto_eliminado = await eliminarAdelantoSueldoPorId(
            req.params.id,
            adelantoSueldoRepository
         );
         res.status(adelanto_eliminado.codigo).json(
            adelanto_eliminado.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = AdelantoSueldoController;
