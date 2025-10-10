const db = require("../../../../database/models");

const moment = require('moment');
const { mapearParaRegistrarTablaPlanillaQuincenal } = require("../../infrastructure/services/mapearParaRegistrarTablaPlanillaQuincenal");

module.exports = async (
  usuario_cierre_id,
  filial_id,
  trabajador_id,
  fecha_anio_mes,
  planillaRepository,
  transaction = null
) => {

      // Verificar si ya hay un registro en cierres_planilla_quincenal
      const cierrePlanillaQuincenal =
        await planillaRepository.obtenerCierrePlanillaQuincenal(
          fecha_anio_mes,
          filial_id,
          transaction
        );

      if (!cierrePlanillaQuincenal) {
        // Registrar el registro de la tabla cierres_planilla_quincenal
        // Crear registro de cierre
        const dataCierrePlanillaQuincenal = {
          filial_id,
          periodo: fecha_anio_mes, // ejemplo de mapeo
          locked_at: null, // loced_at en null porque solo se va a cerrar la planilla quincenal de un trabajador
          usuario_cierre_id,
        };

        const nuevoCierrePlanillaQuincenal =
          await planillaRepository.insertarCierrePlanillaQuincenal(
            dataCierrePlanillaQuincenal,
            transaction
          );

        cierreId = nuevoCierrePlanillaQuincenal.id;
      } else {
        cierreId = cierrePlanillaQuincenal.id;
      }

      if (cierrePlanillaQuincenal?.locked_at) {
        return {
          codigo: 400,
          respuesta: { mensaje: "La planilla quincenal ya fue cerrada" },
        };
      } else {
        // Registrar la planilla quincenal del trabajador
        // Calcular planilla quincenal

      
        const planillaQuincenalTrab =
          await planillaRepository.calcularPlanillaQuincenalTruncaPorTrabajador(
            fecha_anio_mes,
            filial_id,
            trabajador_id,
            transaction
          );

       
          const planillaQuincenalDelTrabajador = planillaQuincenalTrab.planilla.trabajadores; 

        // Verificar si hay planilla quincenal para registrar
        if (planillaQuincenalDelTrabajador.length === 0) {
          return {
            codigo: 400,
            respuesta: { mensaje: "No hay planilla quincenal del trabajador" },
          };
        }

        const dataPlanillaQuincenal= mapearParaRegistrarTablaPlanillaQuincenal(
          planillaQuincenalDelTrabajador,
          fecha_anio_mes,
          filial_id,
          usuario_cierre_id,
          cierreId
        );

        await planillaRepository.insertarVariasPlanillaQuincenal(
          dataPlanillaQuincenal,
          transaction
        );
      }

    return {
      codigo: 201,
      respuesta: {
        mensaje: "Se registro la planilla quincenal del trabajador exitosamente",
      },
    };
  
};
