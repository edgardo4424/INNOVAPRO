const actualizarAsistencia = require("../../application/useCases/actualizarAsistencia");
const crearAsistencia = require("../../application/useCases/crearAsistencia");
const crearAsistenciaSimple = require("../../application/useCases/crearAsistenciaSimple");
const actualizarAsistenciaSimple = require("../../application/useCases/actualizarAsistenciaSimple");

const SequelizeAsistenciaRepository = require("../../infraestructure/repositories/sequelizeAsistenciaRepository");
const obtenerFaltasTrabajadorPorRangoFecha = require("../../application/useCases/obtenerFaltasTrabajadorPorRangoFecha");

const asistenciaRepository = new SequelizeAsistenciaRepository();
const AsistenciaController = {
   async crearAsistencia(req, res) {
      try {
         const asistencia = await crearAsistencia(
            req.body,
            asistenciaRepository
         );
         res.status(asistencia.codigo).json({
            mensaje: asistencia.respuesta.mensaje,
         });
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },

   async actualizarAsistencia(req, res) {
      try {
         const asistencia = await actualizarAsistencia(
            req.body,
            asistenciaRepository
         );
         res.status(asistencia.codigo).json({
            mensaje: asistencia.respuesta.mensaje,
         });
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },
   async actualizarAsistenciaSimple(req, res) {
      try {
         const asistencia = await actualizarAsistenciaSimple(
            req.body,
            asistenciaRepository
         );
         res.status(asistencia.codigo).json({
            mensaje: asistencia.respuesta.mensaje,
         });
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },
   async crearAsistenciaSimple(req, res) {
      try {
         const asistencia = await crearAsistenciaSimple(
            req.body,
            asistenciaRepository
         );
         res.status(asistencia.codigo).json({
            mensaje: asistencia.respuesta.mensaje,
         });
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },

   async obtenerFaltasPorRangoFecha(req, res) {
      try {
         const { trabajador_id, fecha_inicio, fecha_fin } = req.body;

         const faltas = await obtenerFaltasTrabajadorPorRangoFecha(trabajador_id, fecha_inicio, fecha_fin, asistenciaRepository);
         res.status(faltas.codigo).json(faltas.respuesta);
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = AsistenciaController;
