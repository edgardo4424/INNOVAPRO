const SequelizeGratificacionRepository = require("../../modules/gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");
const gratificacionRepository = new SequelizeGratificacionRepository();

const SequelizeCtsRepository = require("../../modules/cts/infraestructure/repositories/sequelizeCtsRepository");
const ctsRepository = new SequelizeCtsRepository();

const SequelizeDarBajaTrabajadorRepository = require("../../modules/dar_baja_trabajadores/infrastructure/repositories/sequelizeDarBajaTrabajadorRepository");
const darBajaTrabajadorRepository = new SequelizeDarBajaTrabajadorRepository();

const SequelizePlanillaRepository = require("../../modules/planilla/infrastructure/repositories/sequelizePlanillaRepository");
const planillaRepository = new SequelizePlanillaRepository();

const SequelizeDataMantenimientoRepository = require("../../modules/data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

const SequelizeAsistenciaRepository = require("../../modules/asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const asistenciaRepository = new SequelizeAsistenciaRepository();

const SequelizeBonoRepository = require("../../modules/bonos/infraestructure/repositories/sequelizeBonoRepository");
const bonoRepository = new SequelizeBonoRepository();

const SequelizeVacacionesRepository = require("../../modules/vacaciones/infraestructure/repositories/sequelizeVacacionesRepository");
const vacacionesRepository = new SequelizeVacacionesRepository();

const SequelizeAdelantoSueldoRepository = require("../../modules/adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();

const db = require("../../database/models");
const sequelize = require("../../database/sequelize");

const moment = require("moment");

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
const { calcularTiempoLaborado } = require("../utils/calcularTiempoEnEmpresa");

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

  try {
    //! Validar la fecha de baja no sea mayor a la fecha de fin contrato del trabajador

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

    if (fechaBaja.isAfter(fechaFinContrato, "day")) {
      //* Si fecha_baja es mayor a la fechaFinContrato
      await transaction.commit();
      return {
        codigo: 400,
        respuesta: {
          mensaje:
            "La fecha de baja no puede ser mayor a la fecha de fin contrato",
        },
      };
    }

    //* Actualizar el contrato laboral con la fecha_terminacion_anticipada
    contratoLaboralEncontrado.fecha_terminacion_anticipada =
      fechaBaja.format("YYYY-MM-DD");

    await contratoLaboralEncontrado.save({ transaction });

    //! 3. Calcular el tiempo total de servicio. (Para que tenga beneficios, minimo tiene que cumplir un mes en la empresa)

    const contratosParaCalcularTiempoLaborado = contratosDelTrabajador.map(
      (contrato) => {
        if (contrato.id == contrato_id) {
          return {
            ...contrato,
            fecha_terminacion_anticipada: fechaBaja.format("YYYY-MM-DD"),
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
    
    const cantidadDiasNoComputadosTodoElTiempoDeServicio =
      await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
        trabajador_id,
        fecha_ingreso_trabajador,
        fechaBaja.format("YYYY-MM-DD")
      );
    
    const total_faltas_y_no_computados = cantidadFaltasInjustificadasDeTodoElTiempoDeServicio + cantidadDiasNoComputadosTodoElTiempoDeServicio;
        //! 5. Calcular el PERIODO COMPUTABLE
    const periodoComputable = restarDias(
      tiempoLaborado,
      total_faltas_y_no_computados
    );

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

    const MONTO_ASIGNACION_FAMILIAR = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_asignacion_familiar"
        )
      ).valor
    );

    const PORCENTAJE_BONIFICACION_ESSALUD = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_bonificacion_essalud"
        )
      ).valor
    );

    const asignacionFamiliarRemuneracion =
      trabajadorEncontrado.asignacion_familiar ? MONTO_ASIGNACION_FAMILIAR : 0;

    let promedioHorasExtras = 0;
    let promedioBonoObra = 0;

    //! 6. Verificar si el trabajador cumple con los beneficios (minimo 1 mes en la empresa)

    if (tiempoLaborado.anios >= 1 || tiempoLaborado.meses >= 1) {
      //! Calculando la remuneracion computable
      const ultimoSueldo = contratoLaboralEncontrado.sueldo;

      //! 7. Obteniendo los datos de mantenimiento

      const MONTO_POR_HORA_EXTRA = Number(
        (await dataMantenimientoRepository.obtenerPorCodigo("valor_hora_extra"))
          .valor
      );

      const asignacionFamiliar = trabajadorEncontrado.asignacion_familiar
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

      promedioHorasExtras =
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

      promedioBonoObra = calculaPromedioBonos(bonosDelTrabajador, 6) || 0;

      //! 10. Calcular la remuneracion computable (OJOOOOOOOO)
      remuneracionComputable =
        ultimoSueldo +
        asignacionFamiliar +
        promedioHorasExtras +
        promedioBonoObra;

      //! 11.Calcular gratificcion trunca

      //* Verificar si ya fue cerrado la gratificacion
      let anio_gratificacion = moment(fechaBaja).format("YYYY");
      let mes_gratificacion = moment(fechaBaja).format("MM");

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
          // 👉 aquí haces el cálculo de la gratificación trunca
          const fechaInicioGrati = obtenerFechaInicioGrati(
            fechaBaja,
            fecha_ingreso_trabajador
          );

          const { mesesComputados } = calcularMesesComputadosGratificacion(
            fechaInicioGrati,
            fechaBaja.format("YYYY-MM-DD")
          );

          const faltas_injustificadas_grati =
            (await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
              trabajador_id,
              fechaInicioGrati,
              fechaBaja
            )) || 0;

          const dias_no_computados_grati =
            (await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
              trabajador_id,
              fechaInicioGrati,
              fechaBaja
            )) || 0;

          const faltas_injustificadas_y_no_computados_grati =
            faltas_injustificadas_grati + dias_no_computados_grati;

          const { meses: mesesGrati, dias: diasGrati } = ajustarMesesPorFaltas(
            mesesComputados,
            faltas_injustificadas_y_no_computados_grati
          );

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

          //* Obtener ultimo deposito de gratificacion

          const periodoUltimaGratificacion =
            moment(fechaInicioGrati).format("YYYY-MM");

          const depositoGratiTrabajador = await db.gratificaciones.findOne({
            where: {
              trabajador_id,
              filial_id,
              periodo: periodoUltimaGratificacion,
            },
            transaction,
          });

          const ultimaFechaDepositoGratificacion = depositoGratiTrabajador
            ? moment(periodoUltimaGratificacion)
                .subtract(1, "days")
                .format("YYYY-MM-DD")
            : null;
          const ultimoBancoDepositoGratificacion = depositoGratiTrabajador
            ? depositoGratiTrabajador.banco
            : null;

          gratificacionTrunca = {
            meses_computados: mesesGrati,
            dias_computados: diasGrati,
            fechaInicioGratificacion: fechaInicioGrati,
            fechaFinGratificacion: fechaBaja.format("YYYY-MM-DD"),
            ultimaFechaDeposito: ultimaFechaDepositoGratificacion,
            ultimoBancoDeposito: ultimoBancoDepositoGratificacion,
            gratificacion_meses: calculoGratificacionTruncaMeses,
            gratificacion_dias: calculoGratificacionTruncaDias,
            bonificacion_essalud: calculoBonificacionEssalud,
            total: redondear2(
              calculoGratificacionNetoTrunca + calculoBonificacionEssalud
            ),
          };
        } else {
          /*  console.log(
            "No corresponde gratificación trunca (ya se pagó en diciembre o se dio de baja después del 15)."
          ); */
        }
      } else {
        /*    console.log("ya fue cerrada la grati"); */
      }

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

      const fechaInicioCts = obtenerFechaInicioCts(
        fechaBaja.format("YYYY-MM-DD"),
        fecha_ingreso_trabajador
      );

      const faltas_injustificadas_cts =
        (await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
          trabajador_id,
          fechaInicioCts,
          fechaBaja
        )) || 0;

      const dias_no_computados_cts =
        (await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
          trabajador_id,
          fechaInicioCts,
          fechaBaja
        )) || 0;

      const faltas_injustificadas_y_no_computados_cts =
        faltas_injustificadas_cts + dias_no_computados_cts;

      const { meses: mesesComputadosCts, dias: diasComputadosCts } =
        calcularMesesDiasCTS(fechaInicioCts, fechaBaja);

      const { meses: mesesCts, dias: diasCts } = ajustarMesesDiasPorFaltasCTS(
        mesesComputadosCts,
        diasComputadosCts,
        faltas_injustificadas_y_no_computados_cts
      );

      const calculoCtsTruncaMeses = redondear2(
        ((remuneracionComputableParaCts * factorRegimen) / 12) * mesesCts || 0
      );

      const calculoCtsTruncaDias = redondear2(
        ((remuneracionComputableParaCts * factorRegimen) / 12 / 30) * diasCts ||
          0
      );

      const calculoCtsNetoTrunca = redondear2(
        calculoCtsTruncaMeses + calculoCtsTruncaDias
      );

      //* Obtener ultimo deposito de cts

      const periodoUltimaCts = moment(fechaInicioCts).format("YYYY-MM");

      const depositoCtsTrabajador = await db.cts.findOne({
        where: {
          trabajador_id,
          filial_id,
          periodo: periodoUltimaCts,
        },
        transaction,
      });

      const ultimaFechaDepositoCts = depositoCtsTrabajador
        ? moment(periodoUltimaCts).subtract(1, "days").format("YYYY-MM-DD")
        : null;
      const ultimoBancoDepositoCts = depositoCtsTrabajador
        ? depositoCtsTrabajador.banco
        : null;

      ctsTrunca = {
        meses_computados: mesesCts,
        dias_computados: diasCts,
        fechaInicioCts: fechaInicioCts,
        fechaFinCts: fechaBaja.format("YYYY-MM-DD"),
        ultimaFechaDeposito: ultimaFechaDepositoCts,
        ultimoBancoDeposito: ultimoBancoDepositoCts,
        sueldo: remuneracionComputable,
        promedio_gratificacion,
        /*         remuneracionComputableParaCts: remuneracionComputableParaCts, */
        calculoCtsTruncaMeses: calculoCtsTruncaMeses,
        calculoCtsTruncaDias: calculoCtsTruncaDias,
        total: calculoCtsNetoTrunca,
      };
    }

    //! 13. Calcular vacaciones truncas

    const calculoVacacionesTruncaAnios =
      redondear2(
        remuneracionComputable * factorRegimen * periodoComputable.anios
      ) || 0;

    const calculoVacacionesTruncaMeses =
      redondear2(
        ((remuneracionComputable * factorRegimen) / 12) *
          periodoComputable.meses
      ) || 0;

    const calculoVacacionesTruncaDias =
      redondear2(
        ((remuneracionComputable * factorRegimen) / 12 / 30) *
          periodoComputable.dias
      ) || 0;

    //* Obtener descuentos vacaciones gozadas

    const cantidadDiasVacacionesGozadas =
      await vacacionesRepository.obtenerCantidadDiasVacacionesGozadas(
        trabajador_id,
        fecha_ingreso_trabajador,
        fechaBaja,
        transaction
      );

    const montoPorDiaVacacionesGozadas = redondear2(
      contratoLaboralEncontrado.sueldo / 30
    );

    const descuentos_vacaciones_gozadas = redondear2(
      montoPorDiaVacacionesGozadas * cantidadDiasVacacionesGozadas
    );

    const subtotal_vacaciones_truncas = redondear2(
      calculoVacacionesTruncaAnios +
        calculoVacacionesTruncaMeses +
        calculoVacacionesTruncaDias -
        descuentos_vacaciones_gozadas
    );

    //* Verificar que tipo de pension pertenece

    let descuentos_ley_vacaciones_trunca = 0;

    const PORCENTAJE_DESCUENTO_AFP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
    );

    const PORCENTAJE_DESCUENTO_SEGURO = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro")).valor
    );

    const PORCENTAJE_DESCUENTO_ONP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_onp")).valor
    );

    const PORCENTAJE_DESCUENTO_AFP_Y_SEGURO = redondear2(
      PORCENTAJE_DESCUENTO_AFP + PORCENTAJE_DESCUENTO_SEGURO
    );

    switch (trabajadorEncontrado.sistema_pension) {
      case "AFP":
        descuentos_ley_vacaciones_trunca = redondear2(
          (subtotal_vacaciones_truncas * PORCENTAJE_DESCUENTO_AFP_Y_SEGURO) /
            100
        );
        break;
      case "ONP":
        descuentos_ley_vacaciones_trunca = redondear2(
          (subtotal_vacaciones_truncas * PORCENTAJE_DESCUENTO_ONP) / 100
        );
        break;

      default:
        break;
    }

    const vacacionesTrunca = {
      anios_computados: periodoComputable.anios,
      meses_computados: periodoComputable.meses,
      dias_computados: periodoComputable.dias,
      fechaInicioVacaciones: fecha_ingreso_trabajador,
      fechaFinVacaciones: fechaBaja.format("YYYY-MM-DD"),
      sueldo: remuneracionComputable,
      calculoVacacionesTruncaAnios,
      calculoVacacionesTruncaMeses,
      calculoVacacionesTruncaDias,
      descuentos_vacaciones_gozadas,
      dias_vacaciones_gozadas: cantidadDiasVacacionesGozadas,
      /*  subtotal_vacaciones_truncas: subtotal_vacaciones_truncas, */
      /*  porcentaje_descuento_sistema_pension:
        trabajadorEncontrado.sistema_pension == "AFP"
          ? PORCENTAJE_DESCUENTO_AFP_Y_SEGURO
          : PORCENTAJE_DESCUENTO_ONP, */
      descuentos_ley: descuentos_ley_vacaciones_trunca,
      total: redondear2(
        subtotal_vacaciones_truncas - descuentos_ley_vacaciones_trunca
      ),
    };

    //! 14. Calcular Remuneracion Trunca

    //* Verificar primero si ya se pagó la planilla del mes actual

    let remuneracion_trunca = null;

    const fecha_anio_mes_planilla_mensual = moment(fechaBaja).format("YYYY-MM");

    const planillaMensualEncontrada =
      await planillaRepository.obtenerCierrePlanillaMensual(
        fecha_anio_mes_planilla_mensual,
        filial_id,
        transaction
      );

    if (!planillaMensualEncontrada) {
      const fecha_inicio_remuneracion = moment(fechaBaja)
        .startOf("month")
        .format("YYYY-MM-DD");
      const fecha_fin_remuneracion = fechaBaja;

      const cantidadDiasRemuneracion =
        moment(fecha_fin_remuneracion).diff(
          moment(fecha_inicio_remuneracion),
          "days"
        ) + 1;

      const sueldoBaseMes = contratoLaboralEncontrado.sueldo;

      const sueldoBaseRemuneracion = redondear2(
        (sueldoBaseMes / 30) * cantidadDiasRemuneracion
      );

      const faltas_injustificadas_remuneracion =
        (await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
          trabajador_id,
          fecha_inicio_remuneracion,
          fecha_fin_remuneracion
        )) || 0;

      const dias_no_computados_remuneracion =
        (await asistenciaRepository.obtenerDiasNoComputablesPorRangoFecha(
          trabajador_id,
          fecha_inicio_remuneracion,
          fecha_fin_remuneracion
        )) || 0;

      const faltas_injustificadas_y_no_computados_remuneracion =
        faltas_injustificadas_remuneracion + dias_no_computados_remuneracion;

      const montoFaltaRemuneracion = redondear2(
        (sueldoBaseMes / 30) *
          faltas_injustificadas_y_no_computados_remuneracion
      );

      const subtotalRemuneracion = redondear2(
        sueldoBaseRemuneracion +
          asignacionFamiliarRemuneracion -
          montoFaltaRemuneracion
      );

      //* Descuentos de ley

      let descuentos_ley_remuneracion = 0;

      switch (trabajadorEncontrado.sistema_pension) {
        case "AFP":
          descuentos_ley_remuneracion = redondear2(
            (subtotalRemuneracion * PORCENTAJE_DESCUENTO_AFP_Y_SEGURO) / 100
          );
          break;
        case "ONP":
          descuentos_ley_remuneracion = redondear2(
            (subtotalRemuneracion * PORCENTAJE_DESCUENTO_ONP) / 100
          );
          break;

        default:
          break;
      }

      //* Validar si ya se pago la planilla quincenal

      const planillaQuincenalEncontrada =
        await planillaRepository.obtenerPlanillaQuincenalPorTrabajador(
          fecha_anio_mes_planilla_mensual,
          filial_id,
          trabajador_id,
          transaction
        );

      let descuento_planilla_quincenal = 0;

      if (planillaQuincenalEncontrada.length > 0) {
        descuento_planilla_quincenal = redondear2(
          Number(planillaQuincenalEncontrada?.[0]?.total_pagar)
        );
      }

      const total_remuneracion = redondear2(
        subtotalRemuneracion -
          descuentos_ley_remuneracion -
          descuento_planilla_quincenal
      );

      remuneracion_trunca = {
        fechaInicioRemuneracion: fecha_inicio_remuneracion,
        fechaFinRemuneracion: fecha_fin_remuneracion.format("YYYY-MM-DD"),
        dias_laborados: cantidadDiasRemuneracion,
        sueldo_base_remuneracion: sueldoBaseRemuneracion,
        asignacion_familiar: asignacionFamiliarRemuneracion,
        dias_faltas_y_no_computados: faltas_injustificadas_y_no_computados_remuneracion,
        monto_dias_faltas_y_no_computados: montoFaltaRemuneracion,
        descuentos_ley: descuentos_ley_remuneracion,
        descuento_planilla_quincenal: descuento_planilla_quincenal,
        total: total_remuneracion,
      };
    }

    const informacionLiquidacion = {
      trabajador_id: trabajador_id,
      fecha_ingreso_trabajador: fecha_ingreso_trabajador,
      fecha_cese: fechaBaja.format("YYYY-MM-DD"),
      motivo_cese: motivo,
      tiempo_servicio: tiempoLaborado,
      faltas_injustificadas:
        cantidadFaltasInjustificadasDeTodoElTiempoDeServicio,
      dias_no_computados: cantidadDiasNoComputadosTodoElTiempoDeServicio,
      periodo_computable: periodoComputable,
      sueldo_base: contratoLaboralEncontrado.sueldo,
      remuneracion_computable: remuneracionComputable,
      regimen_laboral: regimenLaboral,
      sistema_pension: trabajadorEncontrado.sistema_pension,
      porcentaje_descuento_sistema_pension:
        trabajadorEncontrado.sistema_pension == "AFP"
          ? PORCENTAJE_DESCUENTO_AFP_Y_SEGURO
          : PORCENTAJE_DESCUENTO_ONP,
      porcentaje_bonificacion_essalud: PORCENTAJE_BONIFICACION_ESSALUD,
      asignacion_familiar: asignacionFamiliarRemuneracion,
      promedio_horas_extras: promedioHorasExtras,
      promedio_bonos: promedioBonoObra,
    };

    //! 15. Calcular descuentos adicionales

    //* Calcular si tiene adelantos por pagar
    const adelantosPagar =
      await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(
        trabajador_id
      );

    const adelantosPagarFormateado = adelantosPagar.map((adelanto) =>
      adelanto.get({ plain: true })
    );

    const adelantosSimple =
      adelantosPagarFormateado.filter(
        (adelanto) => adelanto.tipo === "simple"
      ) || [];
    const adelantosGratificacion =
      adelantosPagarFormateado.filter(
        (adelanto) => adelanto.tipo === "gratificacion"
      ) || [];
    const adelantosCts =
      adelantosPagarFormateado.filter((adelanto) => adelanto.tipo === "cts") ||
      [];

    const calcularTotalAdelantosSimples = (adelantos) => {
      return (
        adelantos.reduce(
          (total, adelanto) =>
            total +
            ((Number.parseFloat(adelanto.monto) || 0) /
              Number(adelanto.cuotas)) *
              (Number(adelanto.cuotas) - Number(adelanto.cuotas_pagadas)),
          0
        ) || 0
      );
    };

    const totalAdelantosSimp = calcularTotalAdelantosSimples(adelantosSimple);
    const totalAdelantosGrati = calcularTotalAdelantosSimples(
      adelantosGratificacion
    );
    const totalAdelantos_cts = calcularTotalAdelantosSimples(adelantosCts);

    const totalAdelantosSimple = redondear2(totalAdelantosSimp);
    const totalAdelantosGratificacion = redondear2(totalAdelantosGrati);
    const totalAdelantosCts = redondear2(totalAdelantos_cts);

    const totalDescuentosAdicionales =
      totalAdelantosSimple + totalAdelantosGratificacion + totalAdelantosCts;

    const descuentos_adicionales = {
      totalAdelantosSimple,
      totalAdelantosGratificacion,
      totalAdelantosCts,
    };

    const respuesta = {
      informacionLiquidacion,
      gratificacionTrunca,
      ctsTrunca,
      vacacionesTrunca,
      remuneracion_trunca,
      descuentos_adicionales,
    };

    //! Insertar en la tabla baja_trabajadores toda la informacion
    //! OJOOOOOOOOOOOOO añadir en total_liquidacion algun descuento o ingreso

    const estado_liquidacion = "CALCULADA";
    const total_liquidacion = redondear2(
      (gratificacionTrunca?.total || 0) +
        (ctsTrunca?.total || 0) +
        (vacacionesTrunca?.total || 0) +
        (remuneracion_trunca?.total || 0) -
        totalDescuentosAdicionales
    );

    const dataBajaTrabajadores = {
      trabajador_id: trabajador_id,
      contrato_id: contratoLaboralEncontrado.id,
      fecha_ingreso: fecha_ingreso_trabajador,
      fecha_baja: fechaBaja.format("YYYY-MM-DD"),
      motivo: motivo,
      observacion: observacion,
      usuario_registro_id: usuario_cierre_id,
      estado_liquidacion: estado_liquidacion,
      total_liquidacion: total_liquidacion,
      filial_id: contratoLaboralEncontrado.filial_id,
      detalles_liquidacion: respuesta,
    };

    //console.dir(dataBajaTrabajadores, { depth: null });

    const bajaTrabajador =
      await darBajaTrabajadorRepository.insertarRegistroBajaTrabajador(
        dataBajaTrabajadores,
        transaction
      );

    const trabajadorActualizado = await db.trabajadores.findByPk(
      trabajador_id,
      {
        transaction,
      }
    );

    trabajadorActualizado.fecha_baja = fechaBaja.format("YYYY-MM-DD");
    await trabajadorActualizado.save({ transaction });
    
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
