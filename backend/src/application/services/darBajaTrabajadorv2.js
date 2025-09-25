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

const SequelizeDataMantenimientoRepository = require("../../modules/data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");

const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

const SequelizeAsistenciaRepository = require("../../modules/asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();

const SequelizeBonoRepository = require("../../modules/bonos/infraestructure/repositories/sequelizeBonoRepository");
const bonoRepository = new SequelizeBonoRepository();

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
const {
  calcularPeriodoComputableDelContrato,
} = require("../utils/calcularPeriodoComputableDelContrato");
const calcularPromedioHorasExtras = require("../../services/calculoHorasEsxtras");
const calculaPromedioBonos = require("../../services/calculoBonos");
const { restarDias } = require("../utils/restarDias");
const { obtenerFechaInicioGrati } = require("../utils/obtenerFechaInicioGrati");
const {
  calcularMesesComputadosGratificacion,
} = require("../utils/calcularPeriodoGratiTrunca");
const { ajustarMesesPorFaltas } = require("../utils/ajustarMesesPorFaltas");
const { redondear2 } = require("../../shared/utils/redondear2");
const { correspondeGratiTrunca } = require("../utils/correspondeGratiTrunca");
const { obtenerFechaInicioCts } = require("../utils/obtenerFechaInicioCts");
const { calcularMesesDiasCTS } = require("../utils/calcularMesesDiasCts");
const {
  ajustarMesesDiasPorFaltasCTS,
} = require("../utils/ajustarMesesDiasPorFaltasCts");

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
    //! 1. Buscar al trabajador
    const trabajadorEncontrado = await db.trabajadores.findByPk(trabajador_id, {
      transaction,
    });

    if (!trabajadorEncontrado) {
      await transaction.rollback();
      return {
        codigo: 404,
        respuesta: { mensaje: "Trabajador no encontrado" },
      };
    }

    //! 2. Buscar el contrato laboral del trabajador asignando la fecha_baja
    const contratoLaboralEncontrado = await db.contratos_laborales.findByPk(
      contrato_id,
      { transaction }
    );

    if (!contratoLaboralEncontrado) {
      await transaction.rollback();
      return { codigo: 404, respuesta: { mensaje: "Contrato no encontrado" } };
    }

    //* Obtener primero los contratos del trabajador
    const contratos =
      await contratoLaboralRepository.obtenerHistoricoContratosDesdeUltimaAlta(
        trabajador_id,
        transaction
      );

    const contratosDelTrabajador = contratos.map((contrato) =>
      contrato.get({ plain: true })
    );

    //* Comparar si la fecha de baja es menor a la fecha de fin contrato, tomar la fecha de baja como fecha_terminacion_anticipada
    //* sino tomar la fecha fin contrato como fecha_terminacion_anticipada

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
      //* Si fechaBaja es mayor a la fechaFinContrato
      fechaTerminacionAnticipada = fechaFinContrato.clone();
    }

    //* Actualizar el contrato laboral con la fecha_terminacion_anticipada
    contratoLaboralEncontrado.fecha_terminacion_anticipada =
      fechaTerminacionAnticipada.format("YYYY-MM-DD");

    await contratoLaboralEncontrado.save({ transaction });

    //! 3. Calcular el tiempo total de servicio. (Para que tenga beneficios, minimo tiene que cumplir un mes en la empresa)

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

    //* Calculando tiempo laborado
    const { tiempoLaborado } = calcularTiempoLaborado(
      contratosParaCalcularTiempoLaborado
    );

    //! 4. Calcular la cantidad total de faltas injustificadas de TODO el tiempo de servicio

    const fecha_ingreso_trabajador =
      contratosParaCalcularTiempoLaborado.reverse()[0].fecha_inicio;

    const cantidadFaltasInjustificadasDeTodoElTiempoDeServicio =
      await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
        trabajador_id,
        fecha_ingreso_trabajador,
        fechaBaja.format("YYYY-MM-DD")
      );

    console.log(
      "cantidadFaltasInjustificadasDeTodoElTiempoDeServicio",
      cantidadFaltasInjustificadasDeTodoElTiempoDeServicio
    );

    //! 5. Calcular el PERIODO COMPUTABLE
    const periodoComputable = restarDias(
      tiempoLaborado,
      cantidadFaltasInjustificadasDeTodoElTiempoDeServicio
    );

    console.log("periodoComputable", periodoComputable);

    //! inicializar los beneficios
    let gratificacionTrunca = null;
    let ctsTrunca = null;

    let remuneracionComputable = 0;

    const regimenLaboral = contratoLaboralEncontrado.regimen; // MYPE , GENERAL

    let factorRegimen = 0;

    switch (regimenLaboral) {
      case "MYPE":
        factorRegimen = 0.5;
        break;
      case "GENERAL":
        factorRegimen = 1;
        break;
      default:
        break;
    }

    //! 6. Verificar si el trabajador cumple con los beneficios (minimo 1 mes en la empresa)

    if (tiempoLaborado.anios >= 1 || tiempoLaborado.meses >= 1) {
      console.log("CUMPLIO CON LOS BENEFICIOS");
      //! Calculando la remuneracion computable
      const ultimoSueldo = contratoLaboralEncontrado.sueldo;

      //! 7. Obteniendo los datos de mantenimiento
      const MONTO_ASIGNACION_FAMILIAR = Number(
        (
          await dataMantenimientoRepository.obtenerPorCodigo(
            "valor_asignacion_familiar"
          )
        ).valor
      );

      const MONTO_POR_HORA_EXTRA = Number(
        (await dataMantenimientoRepository.obtenerPorCodigo("valor_hora_extra"))
          .valor
      );

      const PORCENTAJE_BONIFICACION_ESSALUD = Number(
        (
          await dataMantenimientoRepository.obtenerPorCodigo(
            "valor_bonificacion_essalud"
          )
        ).valor
      );

      const asignacionFamiliar =
        trabajadorEncontrado.asignacion_familiar &&
        new Date(trabajadorEncontrado.asignacion_familiar) <=
          new Date(fechaBaja)
          ? MONTO_ASIGNACION_FAMILIAR
          : 0;

      //! 8. Obteniendo el promedio horas extras en base a las asistencias

      const fechaFinCalculo = moment(fechaBaja);
      const fechaInicioCalculo = moment(fechaBaja)
        .subtract(5, "months") // restamos 5, porque septiembre cuenta como un mes
        .startOf("month"); // inicio del mes (abril)

      const asistencias =
        await asistenciaRepository.obtenerAsistenciasPorRangoFecha(
          trabajador_id,
          fechaInicioCalculo,
          fechaFinCalculo
        );

      const asistenciasDelTrabajador = asistencias.map((b) => b.dataValues);

      const promedioHorasExtras =
        calcularPromedioHorasExtras(
          asistenciasDelTrabajador,
          MONTO_POR_HORA_EXTRA,
          6
        ) || 0;

      //! 9. Cacular bonos
      const bonosDelTrabajadorPorFecha =
        await bonoRepository.obtenerBonosDelTrabajadorEnRango(
          trabajador_id,
          fechaInicioCalculo,
          fechaFinCalculo
        );

      const bonosDelTrabajador = bonosDelTrabajadorPorFecha.map(
        (b) => b.dataValues
      );

      const promedioBonoObra = calculaPromedioBonos(bonosDelTrabajador, 6) || 0;

      //! 10. Calcular la remuneracion computable
      remuneracionComputable =
        ultimoSueldo +
        asignacionFamiliar +
        promedioHorasExtras +
        promedioBonoObra;

      //! 11.Calcular gratificcion trunca

      //* Verificar si ya fue cerrado la gratificacion
      let anio_gratificacion = moment(fecha_baja).format("YYYY");
      let mes_gratificacion = moment(fecha_baja).format("MM");

      // Si fecha terminacion anticipada esta dentro de la grati de julio, poner periodo = "JULIO"

      let periodo = mes_gratificacion <= 6 ? "JULIO" : "DICIEMBRE";

      // Verificar si ya hay un registro en cierres_Gratificaciones
      const cierreGratificacion =
        await gratificacionRepository.obtenerCierreGratificacion(
          periodo,
          anio_gratificacion,
          filial_id,
          transaction
        );

      if (!cierreGratificacion) {
        const corresponde = correspondeGratiTrunca(
          fechaBaja,
          trabajador_id,
          filial_id,
          transaction
        );

        if (corresponde) {
          console.log("contratosDelTrabajador", contratosDelTrabajador);
          // 👉 aquí haces el cálculo de la gratificación trunca
          const fechaInicioGrati = obtenerFechaInicioGrati(
            fechaBaja,
            fecha_ingreso_trabajador
          );

          console.log("fechaInicioGrati", fechaInicioGrati);
          const { mesesComputados } = calcularMesesComputadosGratificacion(
            fechaInicioGrati,
            fechaBaja.format("YYYY-MM-DD")
          );

          console.log("mesesComputados", mesesComputados);

          const cantidadFaltasEnLaGrati =
            await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
              trabajador_id,
              fechaInicioGrati,
              fechaBaja
            );

          const { meses: mesesGrati, dias: diasGrati } = ajustarMesesPorFaltas(
            mesesComputados,
            cantidadFaltasEnLaGrati
          );

          console.log({
            mesesGrati,
            diasGrati,
          });

          const calculoGratificacionTruncaMeses = redondear2(
            ((remuneracionComputable * factorRegimen) / 6) * mesesGrati || 0
          );
          const calculoGratificacionTruncaDias = redondear2(
            ((remuneracionComputable * factorRegimen) / 6 / 30) * diasGrati || 0
          );
          const calculoGratificacionNetoTrunca = redondear2(
            calculoGratificacionTruncaMeses + calculoGratificacionTruncaDias
          );
          const calculoBonificacionEssalud = redondear2(
            calculoGratificacionNetoTrunca *
              (PORCENTAJE_BONIFICACION_ESSALUD / 100)
          );

          gratificacionTrunca = {
            meses_computados: mesesGrati,
            dias_computados: diasGrati,
            gratificacion_meses: calculoGratificacionTruncaMeses,
            gratificacion_dias: calculoGratificacionTruncaDias,
            grati_neta: calculoGratificacionNetoTrunca,
            bonificacion_essalud: calculoBonificacionEssalud,
            total: redondear2(
              calculoGratificacionNetoTrunca + calculoBonificacionEssalud
            ),
          };
        } else {
          console.log(
            "No corresponde gratificación trunca (ya se pagó en diciembre o se dio de baja después del 15)."
          );
        }
      } else {
        console.log("ya fue cerrada la grati");
      }

      console.log("GRATIFICACION TRUNCA", gratificacionTrunca);

      //! 12. Calcular cts trunca

      const mes = fechaBaja.month() + 1; // moment cuenta meses desde 0
      const año = fechaBaja.year();

      let ultimaGratiPeriodo;

      if (mes >= 7) {
        // De julio a diciembre → última grati fue en julio del mismo año
        ultimaGratiPeriodo = moment(`${año}-07`, "YYYY-MM");
      } else {
        // De enero a junio → última grati fue en diciembre del año anterior
        ultimaGratiPeriodo = moment(`${año - 1}-12`, "YYYY-MM");
      }

      //console.log("ultimaGratiPeriodo", ultimaGratiPeriodo.format("YYYY-MM"));
      const gratificacionPorTrabajador = await db.gratificaciones.findOne({
        where: {
          trabajador_id,
          periodo: ultimaGratiPeriodo.format("YYYY-MM"),
          filial_id,
        },
        transaction,
      });

      const gratificacion_neta = Number(
        gratificacionPorTrabajador?.gratificacion_neta || 0
      ); // Se utiliza la gratificacion sin bonificacion essalud para calcular cts trunca

      const promedio_gratificacion = redondear2(gratificacion_neta / 6);

      const remuneracionComputableParaCts = redondear2(
        remuneracionComputable + promedio_gratificacion
      );

      console.log({
        fechaBaja: fechaBaja.format("YYYY-MM-DD"),
        fecha_ingreso_trabajador,
      });
      const fechaInicioCts = obtenerFechaInicioCts(
        fechaBaja.format("YYYY-MM-DD"),
        fecha_ingreso_trabajador
      );

      const cantidadFaltasEnLaCts =
        await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
          trabajador_id,
          fechaInicioCts,
          fechaBaja
        );

      const { meses: mesesComputadosCts, dias: diasComputadosCts } =
        calcularMesesDiasCTS(fechaInicioCts, fechaBaja);

      const { meses: mesesCts, dias: diasCts } = ajustarMesesDiasPorFaltasCTS(
        mesesComputadosCts,
        diasComputadosCts,
        cantidadFaltasEnLaCts
      );

      const calculoCtsTruncaMeses = redondear2(
        ((remuneracionComputableParaCts * factorRegimen) / 12) * mesesCts || 0
      );
      const calculoCtsTruncaDias = redondear2(
        ((remuneracionComputable * factorRegimen) / 12 / 30) * diasCts || 0
      );
      const calculoCtsNetoTrunca = redondear2(
        calculoCtsTruncaMeses + calculoCtsTruncaDias
      );

      ctsTrunca = {
        meses_computados: mesesCts,
        dias_computados: diasCts,
        sueldo: remuneracionComputable,
        promedio_gratificacion,
        remuneracionComputableParaCts: remuneracionComputableParaCts,
        calculoCtsTruncaMeses: calculoCtsTruncaMeses,
        calculoCtsTruncaDias: calculoCtsTruncaDias,
        total: calculoCtsNetoTrunca,
      };

      console.log("CTS TRUNCA", ctsTrunca);
    }

    //! 13. Calcular vacaciones truncas

    const calculoVacacionesTruncaAnios =
      redondear2(
        remuneracionComputable * factorRegimen * tiempoLaborado.anios
      ) || 0;

    const calculoVacacionesTruncaMeses =
      redondear2(
        ((remuneracionComputable * factorRegimen) / 12) * tiempoLaborado.meses
      ) || 0;

    const calculoVacacionesTruncaDias =
      redondear2(
        ((remuneracionComputable * factorRegimen) / 12 / 30) *
          tiempoLaborado.dias
      ) || 0;

    // obtener descuentos vacaciones gozadas
    const descuentos_vacaciones_gozadas = 0;

    const total_vacaciones_truncas = redondear2(
      calculoVacacionesTruncaAnios +
        calculoVacacionesTruncaMeses +
        calculoVacacionesTruncaDias -
        descuentos_vacaciones_gozadas
    );

    const vacacionesTrunca = {
      anios_computados: periodoComputable.anios,
      meses_computados: periodoComputable.meses,
      dias_computados: periodoComputable.dias,
      sueldo: remuneracionComputable,
      calculoVacacionesTruncaAnios,
      calculoVacacionesTruncaMeses,
      calculoVacacionesTruncaDias,
      descuentos_vacaciones_gozadas,
      total: total_vacaciones_truncas,
    }
    

    const informacionLiquidacion = {
      trabajador_id: trabajador_id,
      fecha_ingreso_trabajador: fecha_ingreso_trabajador,
      fecha_cese: fechaBaja.format("YYYY-MM-DD"),
      motivo_cese: motivo,
      tiempo_servicio: tiempoLaborado,
      faltas_injustificadas:
        cantidadFaltasInjustificadasDeTodoElTiempoDeServicio,
      periodo_computable: periodoComputable,
      remuneracion_computable: remuneracionComputable,
      regimen_laboral: regimenLaboral,
    };

    const respuesta = {
      informacionLiquidacion,
      gratificacionTrunca,
      ctsTrunca,
      vacacionesTrunca
    };

    console.log("respuesta", respuesta);
    asd;
    await transaction.commit();
    return {
      codigo: 201,
      respuesta: {
        mensaje: "Trabajador dada de baja exitosamente",
        data: respuesta,
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
