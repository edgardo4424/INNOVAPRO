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
    const contratos = await contratoLaboralRepository.obtenerHistoricoContratosDesdeUltimaAlta(
      trabajador_id,
      transaction
    );

    const contratosDelTrabajador = contratos.map((contrato) => contrato.get({ plain: true }));

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
        if(contrato.id == contrato_id){
        return {
          ...contrato,
          fecha_terminacion_anticipada: fechaTerminacionAnticipada.format(
            "YYYY-MM-DD"
          ),
        }
        }
      })

    
    //! CAlcular el tiempo en la empresa
    const { tiempoLaborado } = calcularTiempoLaborado(contratosParaCalcularTiempoLaborado);

    //! Cerrar gratificacion trunca
    const gratificacionTrunca = await cierreGratificacionTruncaPorTrabajador(
      usuario_cierre_id,
      filial_id,
      trabajador_id,
      fechaTerminacionAnticipada,
      gratificacionRepository,
      transaction
    );

    // console.log("gratificacionTrunca", gratificacionTrunca);

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


    const darBajaTrabajador = {
      trabajador_id: trabajador_id,
      contrato_id: contrato_id,
      fecha_baja: fecha_baja,
      motivo: motivo,
      observacion: observacion,
      usuario_registro_id: usuario_cierre_id,
      estado_liquidacion: "CALCULADA",
    };

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
