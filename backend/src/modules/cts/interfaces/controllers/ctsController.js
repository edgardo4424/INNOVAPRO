const calcularcts = require("../../application/calcularcts");
const calcularCtsIndividual = require("../../application/calcularCtsIndividual");

const SequelizeCtsRopository = require("../../infraestructure/repositories/sequelizeCtsRepository");

const ctsRepository =new SequelizeCtsRopository();
const ctsController = {

   async calcularCts(req, res) {
      try {
         const { periodo, anio, filial_id } = req.body;

         const cts = await calcularcts(periodo, anio, filial_id, ctsRepository); // Llamamos al caso de uso para obtener todos los gratifiaciones
         

         res.status(200).json(cts.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },
      async calcularCtsIndividual(req, res) {
      try {
         const { periodo, anio, filial_id,trabajador_id } = req.body;

         const cts = await calcularCtsIndividual(periodo, anio, filial_id, ctsRepository,trabajador_id); // Llamamos al caso de uso para obtener todos los gratifiaciones
         

         res.status(200).json(cts.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },
};

module.exports = ctsController; // Exportamos el controlador de Gratificaciones
