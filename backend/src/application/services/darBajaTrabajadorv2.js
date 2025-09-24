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
    //! Buscar al trabajador
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

    console.log('contratosDelTrabajador', contratosDelTrabajador);

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

    //! Calcular el tiempo del ultimo contrato

    const fechaInicioDelMes = fechaTerminacionAnticipada
      .clone()
      .startOf("month");

    const cantidadFaltas =
      await asistenciaRepository.obtenerCantidadFaltasPorRangoFecha(
        trabajador_id,
        fechaInicioDelMes,
        fechaTerminacionAnticipada
      );

    const { periodoComputable } = calcularPeriodoComputableDelContrato(
      contratoLaboralEncontrado,
      cantidadFaltas
    );

    //! Remuneracion computable

    console.log("contratosDelTrabajador", contratosDelTrabajador);

    //! inicializar los beneficios en 0
    let montoGratificacionTrunca = 0;
    let montoCtsTrunca = 0;

    let gratificacionTruncaId = null;
    let ctsTruncaId = null;

    if (tiempoLaborado.meses >= 1) {
      console.log("CUMPLIO CON LOS BENEFICIOS");
      //! Calculando la remuneracion computable
      const ultimoSueldo = contratoLaboralEncontrado.sueldo;

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

      //*Obteniendo el promedio horas extras en base a las asistencias

      const fechaFinCalculo = moment(fechaBaja);
      const fechaInicioCalculo = moment(fechaBaja)
        .subtract(5, "months") // restamos 5, porque septiembre cuenta como un mes
        .startOf("month");     // inicio del mes (abril)


      console.log({
        trabajador_id,
        fechaInicioCalculo,
        fechaFinCalculo
      });

      const asistencias =
        await asistenciaRepository.obtenerAsistenciasPorRangoFecha(
          trabajador_id,
          fechaInicioCalculo,
          fechaFinCalculo
        );

      const asistenciasDelTrabajador = asistencias.map((b) => b.dataValues);



      const promedioHorasExtras = calcularPromedioHorasExtras(
        asistenciasDelTrabajador,
        MONTO_POR_HORA_EXTRA,
        6
      ) || 0;

      console.log('promedioHorasExtras', promedioHorasExtras);

      //! Cacular bonos
      const bonosDelTrabajadorPorFecha =
        await bonoRepository.obtenerBonosDelTrabajadorEnRango(
          trabajador_id,
          fechaInicioCalculo,
          fechaFinCalculo
        );

      const bonosDelTrabajador = bonosDelTrabajadorPorFecha.map(
        (b) => b.dataValues
      );

      const promedioBonoObra = calculaPromedioBonos(
        bonosDelTrabajador,
        6
      ) || 0;

      console.log({
        ultimoSueldo,
        asignacionFamiliar,
        promedioHorasExtras,
        promedioBonoObra
      })

      const remuneracionComputable = ultimoSueldo + asignacionFamiliar + promedioHorasExtras + promedioBonoObra;

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

      console.log('remuneracionComputable', remuneracionComputable);
      //! Calcular gratificcion trunca

      console.log('tiempoLaborado', tiempoLaborado);

      const calculoGratificacionTruncaMeses = ((remuneracionComputable * factorRegimen) / 6) * tiempoLaborado.meses || 0;
      const calculoGratificacionTruncaDias = (((remuneracionComputable * factorRegimen) / 6) / 30) * tiempoLaborado.dias || 0;
      const calculoGratificacionNetoTrunca = calculoGratificacionTruncaMeses + calculoGratificacionTruncaDias;
      const calculoBonificacionEssalud = calculoGratificacionNetoTrunca * (PORCENTAJE_BONIFICACION_ESSALUD / 100);

      const gratificacionTrunca = {
        gratificacion_meses: calculoGratificacionTruncaMeses,
        gratificacion_dias: calculoGratificacionTruncaDias,
        grati_neta: calculoGratificacionNetoTrunca,
        bonificacion_essalud: calculoBonificacionEssalud,
        total: calculoGratificacionNetoTrunca + calculoBonificacionEssalud,
      }

      console.log('gratificacionTrunca', gratificacionTrunca);

      //! Calcular cts trunca

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

      console.log('ultimaGratiPeriodo', ultimaGratiPeriodo.format('YYYY-MM'));
      const gratificacionPorTrabajador = await db.gratificaciones.findOne({
        where: { trabajador_id, periodo: ultimaGratiPeriodo.format("YYYY-MM"), filial_id },
        transaction,
      });
      console.log('gratificacionPorTrabajador', gratificacionPorTrabajador);

    }
    asd;
    await transaction.commit();
    return {
      codigo: 201,
      respuesta: {
        mensaje: "Trabajador dada de baja exitosamente",
        data: {
          remuneracionComputable: remuneracionComputable
        }
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
