const { actualizarCuotasPagadas } = require("../../../../application/services/actualizarCuotasPagadas");
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

      const trabajadoresTipoPlanilla = planillaQuincenal.planilla.trabajadores;
      const trabajadoresTipoHonorarios = planillaQuincenal.honorarios.trabajadores;

      // Verificar si hay planillaQuincenal para registrar
    if ((trabajadoresTipoPlanilla.length === 0)&& (trabajadoresTipoHonorarios.length === 0)) {
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
          data_mantenimiento_detalle: planillaQuincenal.data_mantenimiento_detalle
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
        data_mantenimiento_detalle: planillaQuincenal.data_mantenimiento_detalle
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

    const trabajadoresPlanillaTipoPlanillaYHonorarios = [...trabajadoresTipoPlanilla, ...trabajadoresTipoHonorarios]

    // Mapear y registrar planilla quincenal
    const dataPlanillaQuincenal = mapearParaRegistrarTablaPlanillaQuincenal(
      trabajadoresPlanillaTipoPlanillaYHonorarios,
      fecha_anio_mes,
      filial_id,
      usuario_cierre_id,
      cierre_planilla_quincenal_id,
      planillaQuincenal.data_mantenimiento_detalle
    );


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

    // Actualizar la tabla adelanto_sueldo si en caso en dataPlanillaQuincenalSinCerrar existen adelantos de sueldo
    if (dataPlanillaQuincenalSinCerrar.length > 0) {

       const dataPlanillaQuincenalSinCerrarConAdelantoSueldo = dataPlanillaQuincenalSinCerrar.filter((planillaQuincenal) => {
          return planillaQuincenal.adelanto_sueldo > 0
       })

       const adelantos_ids = dataPlanillaQuincenalSinCerrarConAdelantoSueldo.map((planillaQuincenal) => {
          return planillaQuincenal.adelantos_ids
       })

       await actualizarCuotasPagadas(adelantos_ids.flat(), transaction)
      }

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
