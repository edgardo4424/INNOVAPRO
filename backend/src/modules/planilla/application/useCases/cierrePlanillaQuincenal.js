const db = require("../../../../database/models");
const { mapearParaRegistrarTablaPlanillaQuincenal } = require("../../infrastructure/services/mapearParaRegistrarTablaPlanillaQuincenal");

module.exports = async (
  usuario_cierre_id,
  fecha_anio_mes,
  filial_id,
  planillaQuincenalRepository
  /* transaction = null */
) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción
  try {
   

    // Verificar si ya fue generado la planilla quincenal de la fecha ingresada
    const planillaQuincenalCerrada =
      await planillaQuincenalRepository.obtenerCierrePlanillaQuincenal(
        fecha_anio_mes,
        filial_id
      );

    console.log("planillaQuincenalCerrada", planillaQuincenalCerrada);

    if (planillaQuincenalCerrada && planillaQuincenalCerrada?.locked_at) {
      return {
        codigo: 400,
        respuesta: { mensaje: "La planilla quincenal ya fue cerrada" },
      };
    }

    // Calcular la planilla quincenal
    const planillaQuincenal =
      await planillaQuincenalRepository.calcularPlanillaQuincenal(
        fecha_anio_mes,
        filial_id
      );

      console.log('planillaQuincenal', planillaQuincenal);

      // Verificar si hay planillaQuincenal para registrar
    if (planillaQuincenal.planilla.trabajadores.length === 0) {
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay planilla quincenal para calcular" },
      };
    }

    let cierre_planilla_quincenal_id = null;

    if(planillaQuincenalCerrada){

      cierre_planilla_quincenal_id = planillaQuincenalCerrada.id

      await planillaQuincenalRepository.actualizarCierrePlanillaQuincenal(
        cierre_planilla_quincenal_id,
        {
          locked_at: new Date(),
          usuario_cierre_id,
        },
        transaction
      );
    }else{

      // Crear registro de cierre
      const dataCierrePlanillaQuincenal = {
        filial_id,
        periodo: fecha_anio_mes,
        locked_at: new Date(),
        usuario_cierre_id,
      };
      const cierrePlanillaQuincenal =
        await planillaQuincenalRepository.insertarCierrePlanillaQuincenal(
          dataCierrePlanillaQuincenal,
          transaction
        );
      cierre_planilla_quincenal_id = cierrePlanillaQuincenal.id
    }

    // Verificar primero que planilla quincenal del trabajador ya fue cerrada

    const trabajadoresConPlanillaQuincenalCerrada =
      await planillaQuincenalRepository.obtenerPlanillaQuincenalCerradas(
        fecha_anio_mes,
        filial_id
      );

       //console.log('trabajadoresConPlanillaQuincenalCerrada', trabajadoresConPlanillaQuincenalCerrada);

    const trabajadoresConPlanillaQuincenalCerradas = trabajadoresConPlanillaQuincenalCerrada.map(
      (planillaQuincenal) => {
        return {
          trabajador_id: planillaQuincenal.trabajador_id,
          contrato_id: planillaQuincenal.contrato_id,
        }
      }
    );

    // Mapear y registrar planilla quincenal
    const dataPlanillaQuincenal = mapearParaRegistrarTablaPlanillaQuincenal(
      planillaQuincenal.planilla.trabajadores,
      fecha_anio_mes,
      filial_id,
      usuario_cierre_id,
      cierre_planilla_quincenal_id
    );

    console.log('dataPlanillaQuincenal',dataPlanillaQuincenal);

    const dataPlanillaQuincenalSinCerrar = dataPlanillaQuincenal.filter((planillaQuincenal) => {
      return !trabajadoresConPlanillaQuincenalCerradas.some((planillaQuincenalCerrada) => {
        return (
          planillaQuincenalCerrada.trabajador_id === planillaQuincenal.trabajador_id &&
          planillaQuincenalCerrada.contrato_id === planillaQuincenal.contrato_id
        );
      });
    });

    //console.log('dataPlanillaQuincenalSinCerrar', dataPlanillaQuincenalSinCerrar);

    await planillaQuincenalRepository.insertarVariasPlanillaQuincenal(
      dataPlanillaQuincenalSinCerrar,
      transaction
    );


    await transaction.commit(); // ✔ Confirmar transacción

    return {
      codigo: 201,
      respuesta: {
        mensaje:
          "Se registró la planilla quincenal para ese periodo exitosamente",
      },
    };
  } catch (error) {
    console.error("Error en cierre de planillas quincenal:", error);
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al realizar el cierre de planilla quincenal" },
    };
  }
};
