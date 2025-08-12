const crearBono = require("../../application/useCases/crearBono");
const editarBono = require("../../application/useCases/editarBono");
const eliminarBonoPorId = require("../../application/useCases/eliminarBonoPorId");
const obtenerBonos = require("../../application/useCases/obtenerBonos");
const obtenerBonosDelTrabajadorEnRango = require("../../application/useCases/obtenerBonosDelTrabajadorEnRango");
const obtenerBonosPorTrabajadorId = require("../../application/useCases/obtenerBonosPorTrabajadorId");
const SequelizeBonoRepository = require("../../infraestructure/repositories/sequelizeBonoRepository");

const bonoRepository = new SequelizeBonoRepository();
const BonosController = {
   async crearBono(req, res) {
      try {
         const nuevoBono = await crearBono(req.body, bonoRepository);
         res.status(nuevoBono.codigo).json(nuevoBono.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async editarBono(req, res) {
      try {
         const bonoActualizado = await editarBono(req.body, bonoRepository);
         res.status(bonoActualizado.codigo).json(bonoActualizado.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerBonosPorTrabajadorId(req, res) {
      try {
         const bonosPorTrabajadorId = await obtenerBonosPorTrabajadorId(
            req.params.id,
            bonoRepository
         );
         res.status(bonosPorTrabajadorId.codigo).json(
            bonosPorTrabajadorId.respuesta
         );
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async eliminarBonoPorId(req, res) {
      try {
         const bonoEliminado = await eliminarBonoPorId(
            req.params.id,
            bonoRepository
         );
         res.status(bonoEliminado.codigo).json(bonoEliminado.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerBonos(req, res) {
      try {
         const bonos = await obtenerBonos(bonoRepository);
         res.status(bonos.codigo).json(bonos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerBonosDelTrabajadorEnRango(req, res) {
      try {
         const bonos = await obtenerBonosDelTrabajadorEnRango(
            req.body,
            bonoRepository
         );
         res.status(bonos.codigo).json(bonos.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = BonosController;
