const actualizarAsistencia = require("../../application/useCases/actualizarAsistencia");
const crearAsistencia = require("../../application/useCases/crearAsistencia");
const SequelizeAsistenciaRepository = require("../../infraestructure/repositories/sequelizeAsistenciaRepository");

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
};

module.exports = AsistenciaController;
