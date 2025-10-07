const sequelizePlanillaRepository = require("../../infrastructure/repositories/sequelizePlanillaRepository"); // Importamos el repositorio de planilla
// Importamos el caso de uso para obtener todos los planilla
const calcularPlanillaQuincenal = require("../../application/useCases/calcularPlanillaQuincenal");
const calcularPlanillaMensualPorTrabajador = require("../../application/useCases/calcularPlanillaMensualPorTrabajador");
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const cierrePlanillaQuincenal = require("../../application/useCases/cierrePlanillaQuincenal");
const obtenerPlanillaQuincenalCerradas = require("../../application/useCases/obtenerPlanillaQuincenalCerradas");
const obtenerPlanillaQuincenalPorTrabajador = require("../../application/useCases/obtenerPlanillaQuincenalPorTrabajador");
const obtenerTotalPlanillaQuincenalPorTrabajador = require("../../application/useCases/obtenerTotalPlanillaQuincenalPorTrabajador");
const cierrePlanillaMensual = require("../../application/useCases/cierrePlanillaMensual");
const sequelize = require("../../../.././config/db");
const obtenerPlanillaMensualCerradas = require("../../application/useCases/obtenerPlanillaMensualCerradas");
const calcularPlanillaMensualTruncaPorTrabajador = require("../../application/useCases/calcularPlanillaMensualTruncaPorTrabajador");
const SequelizeDataRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const exportarPlame = require("../../application/useCases/exportarPlame");
const obtenerReciboPorPlanilla = require("../../application/useCases/obtenerReciboPorPlanilla");

const planillaRepository = new sequelizePlanillaRepository();
const trabajadorRepository = new SequelizeTrabajadorRepository();
const dataRepository=new SequelizeDataRepository()

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
         const { anio_mes_dia, filial_id } = req.body;
         const planilla = await calcularPlanillaMensualPorTrabajador(
            anio_mes_dia,
            filial_id,
            planillaRepository,
            trabajadorRepository,
            dataRepository
         );
         res.status(planilla.codigo).json(planilla.respuesta);
      } catch (error) {
         console.log(error);

         res.status(503).json({ error: error.message });
      }
   },
   async calcularPlanillaMensualTruncaPorTrabajador(req, res) {
      const transaction = await sequelize.transaction();

      try {
         const { anio_mes_dia, filial_id, trabajador_id } = req.body;
         const usuario_cierre_id = req.usuario.id;

         const planilla = await calcularPlanillaMensualTruncaPorTrabajador(
            anio_mes_dia,
            filial_id,
            planillaRepository,
            trabajadorRepository,
            trabajador_id,
            usuario_cierre_id,
            transaction
         );
         await transaction.commit();

         res.status(planilla.codigo).json(planilla.respuesta);
      } catch (error) {
         await transaction.rollback();

         res.status(503).json({ error: error.message });
      }
   },
   async cierrePlanillaQuincenal(req, res) {
      try {
         const { fecha_anio_mes, filial_id } = req.body;
         console.log(req.body);
         const usuario_cierre_id = req.usuario.id;
         const planilla = await cierrePlanillaQuincenal(
            usuario_cierre_id,
            fecha_anio_mes,
            filial_id,
            planillaRepository
         );
         res.status(planilla.codigo).json(planilla.respuesta);
      } catch (error) {
         res.status(503).json({ error: error.message });
      }
   },

   async cierrePlanillaMensual(req, res) {
      const transaction = await sequelize.transaction();

      try {
         const { fecha, filial_id, array_trabajadores } = req.body;
         const usuario_cierre_id = req.usuario.id;

         console.log("Array de trabajadores",array_trabajadores);
         
         const cierrePM = await cierrePlanillaMensual(
            usuario_cierre_id,
            planillaRepository,
            array_trabajadores,
            filial_id,
            fecha,
            transaction
         );
          await transaction.commit();
         res.status(cierrePM.codigo).json(cierrePM.respuesta);
      } catch (error) {
         console.log("Error alc errar la planilla mensual: ",error);
         await transaction.rollback();
         res.status(500).json({ error: error.message });
      }
   },

   async obtenerPlanillaQuincenalCerradas(req, res) {
      try {
         const planillaQuincenalCerradas =
            await obtenerPlanillaQuincenalCerradas(
               req.body,
               planillaRepository
            ); // Llamamos al caso de uso para obtener todos los planillaQuincenalCerradas

         res.status(planillaQuincenalCerradas.codigo).json(
            planillaQuincenalCerradas.respuesta
         ); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },

   async obtenerReciboPorPlanilla(req,res){
      try {
         const planillas_recibos=await obtenerReciboPorPlanilla(
            req.params,
            planillaRepository,
            
         ); 
         res.status(planillas_recibos.codigo).json(planillas_recibos.respuesta)
      } catch (error) {
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },

   async obtenerPlanillaMensualCerradas(req, res) {
      try {
         const planillaMensualCerradas = await obtenerPlanillaMensualCerradas(
            req.body,
            planillaRepository
         ); // Llamamos al caso de uso para obtener todos los planillaMensualCerradas

         res.status(planillaMensualCerradas.codigo).json(
            planillaMensualCerradas.respuesta
         ); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },
   async exportarPlame(req, res) {
      try {
         await exportarPlame(
            res,
            req.body,
            planillaRepository,
            
         ); 
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },

   async obtenerPlanillaQuincenalPorTrabajador(req, res) {
      try {
         const { fecha_anio_mes, filial_id, trabajador_id } = req.body;

         const planillaQuincenalPorTrabajador =
            await obtenerPlanillaQuincenalPorTrabajador(
               fecha_anio_mes,
               filial_id,
               trabajador_id,
               planillaRepository
            ); // Llamamos al caso de uso para obtener todos las planillas

         res.status(planillaQuincenalPorTrabajador.codigo).json(
            planillaQuincenalPorTrabajador.respuesta
         ); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },

   async obtenerTotalPlanillaQuincenalPorTrabajador(req, res) {
      try {
         console.log("entre");
         const { fecha_anio_mes, filial_id, trabajador_id } = req.body;

         const planillaQuincenalPorTrabajadorTotal =
            await obtenerTotalPlanillaQuincenalPorTrabajador(
               fecha_anio_mes,
               filial_id,
               trabajador_id,
               planillaRepository
            ); // Llamamos al caso de uso para obtener todos los planilla

         res.status(planillaQuincenalPorTrabajadorTotal.codigo).json(
            planillaQuincenalPorTrabajadorTotal.respuesta
         ); // 🔥 Siempre devuelve un array, aunque esté vacío
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message }); // Respondemos con un error
      }
   },
};

module.exports = PlanillaController;
