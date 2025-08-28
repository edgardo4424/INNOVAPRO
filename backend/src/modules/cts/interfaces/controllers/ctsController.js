const calcularcts = require("../../application/calcularcts");
const calcularCtsIndividual = require("../../application/calcularCtsIndividual");
const cierreCts = require("../../application/cierreCts");
const obtenerHistoricocts = require("../../application/obtenerHistoricocts");

const SequelizeCtsRopository = require("../../infraestructure/repositories/sequelizeCtsRepository");

const ctsRepository = new SequelizeCtsRopository();
const ctsController = {
   async calcularCts(req, res) {
      try {
         const { periodo, anio, filial_id } = req.body;
         const cts = await calcularcts(periodo, anio, filial_id, ctsRepository);
         res.status(200).json(cts.respuesta);
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message });
      }
   },
   async calcularCtsIndividual(req, res) {
      try {
         const { periodo, anio, filial_id, trabajador_id } = req.body;
         const cts = await calcularCtsIndividual(
            periodo,
            anio,
            filial_id,
            ctsRepository,
            trabajador_id
         );
         res.status(200).json(cts.respuesta);
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message });
      }
   },
   async cierreCts(req, res) {
      try {
         const { periodo, anio, filial_id, array_cts } = req.body;
         const usuario_cierre_id = req.usuario.id;

         const registros_cts = await cierreCts(
            periodo,
            anio,
            filial_id,
            array_cts,
            ctsRepository,
            usuario_cierre_id
         );
         res.status(registros_cts.codigo).json(registros_cts.respuesta);
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },
   async obtenerHistoricocts(req, res) {
      const { periodo, anio, filial_id } = req.body;      
      try {
         const response = await obtenerHistoricocts(
            periodo,
            anio,
            filial_id,
            ctsRepository
         );
         res.status(response.codigo).json(response.respuesta);
      } catch (error) {
         console.log(error);
         
         res.status(500).json({ error: error.message });
      }
   },
};

module.exports = ctsController;
