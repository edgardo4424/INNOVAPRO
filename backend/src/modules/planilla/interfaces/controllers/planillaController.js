const sequelizePlanillaRepository = require("../../infrastructure/repositories/sequelizePlanillaRepository"); // Importamos el repositorio de planilla
// Importamos el caso de uso para obtener todos los planilla
const calcularPlanillaQuincenal = require("../../application/useCases/calcularPlanillaQuincenal");
const calcularPlanillaMensualPorTrabajador = require("../../application/useCases/calcularPlanillaMensualPorTrabajador");
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");

const planillaRepository = new sequelizePlanillaRepository();
const trabajadorRepository=new SequelizeTrabajadorRepository()
const PlanillaController = {
   async calcularPlanillaQuincenal(req, res) {
      try {
         const { fecha_anio_mes, filial_id } = req.body;
        console.log(req.body);
        
         const planilla = await calcularPlanillaQuincenal(
            fecha_anio_mes,
            filial_id,
            planillaRepository
         );

         res.status(planilla.codigo).json(planilla.respuesta);
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message });
      }
   },
   async calcularPlanillaMensualPorTrabajador(req, res) {
      try {
         const { anio_mes_dia, filial_id} = req.body;
         console.log('Body es ',req.body);
         
         const planilla = await calcularPlanillaMensualPorTrabajador(
            anio_mes_dia,
            filial_id,
            planillaRepository,
            trabajadorRepository
         );
         res.status(planilla.codigo).json(planilla.respuesta);
      } catch (error) {
         console.log('El error es',error);
         
         res.status(503).json({ error: error.message });
      }
   },
};

module.exports = PlanillaController;
