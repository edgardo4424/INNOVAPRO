const editarContratoLaboral = require("../../modules/contratos_laborales/application/useCases/editarContratoLaboral");

const cierreGratificacionTruncaPorTrabajador = require("../../modules/gratificaciones/application/useCases/cierreGratificacionTruncaPorTrabajador");

const SequelizeGratificacionRepository = require("../../modules/gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");

const gratificacionRepository = new SequelizeGratificacionRepository();

const SequelizeCtsRepository = require("../../modules/cts/infraestructure/repositories/sequelizeCtsRepository");

const ctsRepository = new SequelizeCtsRepository();

const SequelizeDarBajaTrabajadorRepository = require("../../modules/dar_baja_trabajadores/infrastructure/repositories/sequelizeDarBajaTrabajadorRepository");

const darBajaTrabajadorRepository = new SequelizeDarBajaTrabajadorRepository();

const SequelizePlanillaRepository = require("../../modules/planilla/infrastructure/repositories/sequelizePlanillaRepository");

const planillaRepository = new SequelizePlanillaRepository();

const SequelizeTrabajadorRepository = require("../../modules/trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");

const trabajadorRepository = new SequelizeTrabajadorRepository();

const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

const SequelizeAsistenciaRepository = require("../../modules/asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();

const db = require("../../database/models");
const sequelize = require("../../database/sequelize");
const InsertarRegistroBajaTrabajador = require("../../modules/dar_baja_trabajadores/application/useCases/InsertarRegistroBajaTrabajador");

const moment = require("moment");
const cierreCtsTruncaPorTrabajador = require("../../modules/cts/application/cierreCtsTruncaPorTrabajador");
const {
  obtenerUltimoDiaDelMes,
} = require("../../modules/adelanto_sueldo/infraestructure/repositories/utils/validarCuotaAplicable");
const calcularPlanillaMensualTruncaPorTrabajador = require("../../modules/planilla/application/useCases/calcularPlanillaMensualTruncaPorTrabajador");
const cierrePlanillaQuincenal = require("../../modules/planilla/application/useCases/cierrePlanillaQuincenal");
const cierrePlanillaQuincenalTruncaPorTrabajador = require("../../modules/planilla/application/useCases/cierrePlanillaQuincenalTruncaPorTrabajador");
const { calcularTiempoLaborado } = require("../utils/calcularTiempoEnEmpresa");
const { calcularPeriodoComputableDelContrato } = require("../utils/calcularPeriodoComputableDelContrato");

module.exports = async function darBajaTrabajador(dataBody) {
  const transaction = await sequelize.transaction();

  const {
    usuario_cierre_id,
    filial_id,
    trabajador_id,
    contrato_id,
    fecha_baja,
    motivo,
    observacion,
  } = dataBody;

  // console.log("dataBody", dataBody);

  try {
    //! Buscar el contrato laboral del trabajador asignando la fecha_baja
    const contratoLaboralEncontrado = await db.contratos_laborales.findByPk(
      contrato_id,
      { transaction }
    );

    if (!contratoLaboralEncontrado) {
      await transaction.rollback();
      return { codigo: 404, respuesta: { mensaje: "Contrato no encontrado" } };
    }

    //! Calcular beneficios. (Para que tenga beneficios, minimo tiene que cumplir un mes en la empresa)

    //* Obtener primero los contratos del trabajador
    const contratos =
      await contratoLaboralRepository.obtenerHistoricoContratosDesdeUltimaAlta(
        trabajador_id,
        transaction
      );

    const contratosDelTrabajador = contratos.map((contrato) =>
      contrato.get({ plain: true })
    );

    //console.log('contratosDelTrabajador',contratosDelTrabajador);

    //! Comparar si la fecha de baja es menor a la fecha de fin contrato, tomar la fecha de baja como fecha_terminacion_anticipada
    // !sino tomar la fecha fin contrato como fecha_terminacion_anticipada

    const fechaBaja = moment(fecha_baja, "YYYY-MM-DD");
    const fechaFinContrato = moment(
      contratoLaboralEncontrado.fecha_fin,
      "YYYY-MM-DD"
    );

    let fechaTerminacionAnticipada = null;
    if (fechaBaja.isSameOrBefore(fechaFinContrato, "day")) {
      //! Si fechaBaja es menor o igual a la fechaFinContrato
      fechaTerminacionAnticipada = fechaBaja.clone();
    } else {
      //! Si fechaBaja es mayor a la fechaFinContrato
      fechaTerminacionAnticipada = fechaFinContrato.clone();
    }

    //! Actualizar el contrato laboral con la fecha_terminacion_anticipada
    contratoLaboralEncontrado.fecha_terminacion_anticipada =
      fechaTerminacionAnticipada.format("YYYY-MM-DD");

    await contratoLaboralEncontrado.save({ transaction });

    const contratosParaCalcularTiempoLaborado = contratosDelTrabajador.map(
      (contrato) => {
        if (contrato.id == contrato_id) {
          return {
            ...contrato,
            fecha_terminacion_anticipada:
              fechaTerminacionAnticipada.format("YYYY-MM-DD"),
          };
        } else {
          return {
            ...contrato,
          };
        }
      }
    );

    //! Calcular el tiempo en la empresa
    const { tiempoLaborado } = calcularTiempoLaborado(
      contratosParaCalcularTiempoLaborado
    );


    console.log('tiempoLaborado', tiempoLaborado);

    //! Calcular el tiempo del ultimo contrato


    const fechaInicioDelMes = fechaTerminacionAnticipada
      .clone()
      .startOf("month")
      
    console.log({
      trabajador_id,
      fecha_inicio: fechaInicioDelMes.format("YYYY-MM-DD"),
      fecha_terminacion_anticipada: fechaTerminacionAnticipada.format("YYYY-MM-DD")
    });

    const cantidadFaltas = await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
      trabajador_id,
      fechaInicioDelMes,
      fechaTerminacionAnticipada
    )

    console.log('cantidadFaltas', cantidadFaltas);
    console.log('contratoLaboralEncontrado', contratoLaboralEncontrado);
    
    const { periodoComputable } = calcularPeriodoComputableDelContrato(contratoLaboralEncontrado, cantidadFaltas)
    
    console.log('periodoComputable', periodoComputable);

    //! Cerrar gratificacion trunca
    const gratificacionTrunca = await cierreGratificacionTruncaPorTrabajador(
      usuario_cierre_id,
      filial_id,
      trabajador_id,
      fechaTerminacionAnticipada,
      gratificacionRepository,
      transaction
    );

    const {gratificacion_trunca} = gratificacionTrunca.respuesta;
    const gratificacionTruncaId = gratificacion_trunca ? gratificacion_trunca.id : null;
const montoGratificacionTrunca = gratificacion_trunca ? Number(gratificacion_trunca.total_pagar) : 0;

    // Cerrar cts trunca
    const ctsTrunca = await cierreCtsTruncaPorTrabajador(
      usuario_cierre_id,
      filial_id,
      trabajador_id,
      fechaTerminacionAnticipada,
      ctsRepository,
      transaction
    );

    console.log("ctsTrunca", ctsTrunca);

    
    const {cts_trunca} = ctsTrunca.respuesta;
    const ctsTruncaId = cts_trunca ? cts_trunca.id : null;
    const montoCtsTrunca = cts_trunca ? Number(cts_trunca.cts_depositar) : 0;

    // Crear una fecha que represente el día 15 de ese mes/año
    const dia15 = moment({
      year: fechaTerminacionAnticipada.year(),
      month: fechaTerminacionAnticipada.month(), // month() es 0-based
      day: 15,
    });

    // Si fechaTerminacionAnticipada es posterior al dia 15, cerrar planilla quincenal
    // Si no cerrar solamente la planilla mensual trunca
    if (fechaTerminacionAnticipada.isAfter(dia15, "day")) {
      // Cerrar planilla quincenal trunca
      const fecha_anio_mes = fechaTerminacionAnticipada.format("YYYY-MM");

      const planillaQuincenalTrunca =
        await cierrePlanillaQuincenalTruncaPorTrabajador(
          usuario_cierre_id,
          filial_id,
          trabajador_id,
          fecha_anio_mes,
          planillaRepository,
          transaction
        );
    }
    // Sino cerrar planilla

    const anioMesDia = fechaTerminacionAnticipada
      .clone()
      .endOf("month")
      .format("YYYY-MM-DD");

    const planillaMensualTrunca =
      await calcularPlanillaMensualTruncaPorTrabajador(
        anioMesDia,
        filial_id,
        planillaRepository,
        trabajadorRepository,
        trabajador_id,
        usuario_cierre_id,
        transaction
      );

      const {planillas_creadas} = planillaMensualTrunca.respuesta;
    
      const planilla_mensual_trunca = planillas_creadas[planillas_creadas.length - 1];
      console.log('planilla_mensual_trunca', planilla_mensual_trunca);
      const montoPlanillaMensualTrunca = planilla_mensual_trunca ? Number(planilla_mensual_trunca.saldo_por_pagar) : 0;

      const total_liquidacion = montoCtsTrunca + 0 + montoGratificacionTrunca + montoPlanillaMensualTrunca;

      const fecha_ingreso_trabajador = contratosParaCalcularTiempoLaborado.reverse()[0].fecha_inicio;

    const darBajaTrabajador = {
      trabajador_id: trabajador_id,
      contrato_id: contrato_id,
      fecha_ingreso: fecha_ingreso_trabajador,
      fecha_baja: fechaTerminacionAnticipada.format("YYYY-MM-DD"),
      motivo: motivo,
      observacion: observacion,
      usuario_registro_id: usuario_cierre_id,
      estado_liquidacion: "CALCULADA",

      tiempo_laborado_anios: tiempoLaborado.anios,
      tiempo_laborado_meses: tiempoLaborado.meses,
      tiempo_laborado_dias: tiempoLaborado.dias,

      tiempo_computado_anios: periodoComputable.anios,
      tiempo_computado_meses: periodoComputable.meses,
      tiempo_computado_dias: periodoComputable.dias,

      gratificacion_trunca_id: gratificacionTruncaId,
      cts_trunca_id: ctsTruncaId,
      planilla_mensual_trunca_id: planilla_mensual_trunca.id,

      //Montos truncos
      cts_trunca_monto: montoCtsTrunca,
      vacaciones_truncas_monto: 0,
      gratificacion_trunca_monto: montoGratificacionTrunca,
      remuneracion_trunca_monto: montoPlanillaMensualTrunca,

      // otros descuentos
      afp_descuento: 0,
      adelanto_descuento: 0,
      otros_descuentos: 0,

      total_liquidacion: total_liquidacion,
      detalle_remuneracion_computable: {}
       
    };

    console.log('darBajaTrabajador', darBajaTrabajador);

    console.log('contratosParaCalcularTiempoLaborado', contratosParaCalcularTiempoLaborado);

    // Insertar en la tabla bajas_trabajadores
    const registroBajaTrabajador = await InsertarRegistroBajaTrabajador(
      darBajaTrabajador,
      transaction,
      darBajaTrabajadorRepository
    );

    if (registroBajaTrabajador.codigo != 201) {
      await transaction.rollback();
      return {
        codigo: registroBajaTrabajador.codigo,
        respuesta: registroBajaTrabajador.respuesta,
      };
    }

    const trabajadorActualizado = await db.trabajadores.findByPk(
      trabajador_id,
      {
        transaction,
      }
    );

    trabajadorActualizado.fecha_baja = fecha_baja;
    await trabajadorActualizado.save({ transaction });

    await transaction.commit();
    return {
      codigo: 201,
      respuesta: {
        mensaje: "Trabajador dada de baja exitosamente",
      },
    };
  } catch (error) {
    console.log("error", error);
    await transaction.rollback();
    return {
      codigo: 500,
      respuesta: {
        mensaje: "Error inesperado: " + error.message,
      },
    };
  }
};
