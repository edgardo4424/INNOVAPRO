const sequelizePlanillaRepository = require("../../infrastructure/repositories/sequelizePlanillaRepository"); // Importamos el repositorio de planilla
// Importamos el caso de uso para obtener todos los planilla
const calcularPlanillaQuincenal = require("../../application/useCases/calcularPlanillaQuincenal");
const calcularPlanillaMensualPorTrabajador = require("../../application/useCases/calcularPlanillaMensualPorTrabajador");
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const cierrePlanillaQuincenal = require("../../application/useCases/cierrePlanillaQuincenal");
const obtenerPlanillaQuincenalCerradas = require("../../application/useCases/obtenerPlanillaQuincenalCerradas");
const obtenerPlanillaQuincenalPorTrabajador = require("../../application/useCases/obtenerPlanillaQuincenalPorTrabajador");
const obtenerTotalPlanillaQuincenalPorTrabajador = require("../../application/useCases/obtenerTotalPlanillaQuincenalPorTrabajador");

const planillaRepository = new sequelizePlanillaRepository();
const trabajadorRepository = new SequelizeTrabajadorRepository();

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
      console.log("Body es ", req.body);

      const planilla = await calcularPlanillaMensualPorTrabajador(
        anio_mes_dia,
        filial_id,
        planillaRepository,
        trabajadorRepository
      );
      res.status(planilla.codigo).json(planilla.respuesta);
    } catch (error) {
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

  async obtenerPlanillaQuincenalCerradas(req, res) {
    try {
      const planillaQuincenalCerradas = await obtenerPlanillaQuincenalCerradas(
        req.body,
        planillaRepository
      ); // Llamamos al caso de uso para obtener todos los planillaQuincenalCerradas

      res
        .status(planillaQuincenalCerradas.codigo)
        .json(planillaQuincenalCerradas.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
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

      res
        .status(planillaQuincenalPorTrabajador.codigo)
        .json(planillaQuincenalPorTrabajador.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
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

      res
        .status(planillaQuincenalPorTrabajadorTotal.codigo)
        .json(planillaQuincenalPorTrabajadorTotal.respuesta); // 🔥 Siempre devuelve un array, aunque esté vacío
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error.message }); // Respondemos con un error
    }
  },
};

module.exports = PlanillaController;
