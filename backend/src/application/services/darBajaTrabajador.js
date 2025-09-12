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
const db = require("../../database/models");
const sequelize = require("../../database/sequelize");
const InsertarRegistroBajaTrabajador = require("../../modules/dar_baja_trabajadores/application/useCases/InsertarRegistroBajaTrabajador");

const moment = require("moment");
const cierreCtsTruncaPorTrabajador = require("../../modules/cts/application/cierreCtsTruncaPorTrabajador");
const { obtenerUltimoDiaDelMes } = require("../../modules/adelanto_sueldo/infraestructure/repositories/utils/validarCuotaAplicable");
const calcularPlanillaMensualTruncaPorTrabajador = require("../../modules/planilla/application/useCases/calcularPlanillaMensualTruncaPorTrabajador");

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

  console.log("dataBody", dataBody);

  try {
    // Actualizar el contrato laboral del trabajador asignando la fecha_baja
    const contratoLaboralEncontrado = await db.contratos_laborales.findByPk(
      contrato_id,
      { transaction }
    );

    console.log("contratoLaboralEncontrado", contratoLaboralEncontrado);
    // Comparar si la fecha de baja es menor a la fecha de fin contrato, tomar la fecha de baja como fecha_terminacion_anticipada
    // sino tomar la fecha fin contrato como fecha_terminacion_anticipada

     // Comparar 2 fechas con Date
    const fechaBaja = moment(fecha_baja, "YYYY-MM-DD");
    const fechaFinContrato = moment(contratoLaboralEncontrado.fecha_fin, "YYYY-MM-DD");

    let fechaTerminacionAnticipada = null;

if (fechaBaja.isSame(fechaFinContrato, "day")) {
  fechaTerminacionAnticipada=fechaBaja
} else if (fechaBaja.isBefore(fechaFinContrato, "day")) {
  fechaTerminacionAnticipada=fechaBaja
} else {
  fechaTerminacionAnticipada=fechaFinContrato
}


    contratoLaboralEncontrado.fecha_terminacion_anticipada = fechaTerminacionAnticipada;

    await contratoLaboralEncontrado.save({ transaction });

    const trabajadorActualizado = await db.trabajadores.findByPk(
      trabajador_id,
      {
        transaction,
      }
    );

    trabajadorActualizado.fecha_baja = fecha_baja;
    await trabajadorActualizado.save({ transaction });

   
    

    // Cerrar gratificacion trunca
    const gratificacionTrunca = await cierreGratificacionTruncaPorTrabajador(
      usuario_cierre_id,
      filial_id,
      trabajador_id,
      fechaTerminacionAnticipada,
      gratificacionRepository,
      transaction
    );

    console.log("gratificacionTrunca", gratificacionTrunca);

    // Cerrar cts trunca
    const ctsTrunca = await cierreCtsTruncaPorTrabajador(
      usuario_cierre_id,
      filial_id,
      trabajador_id,
      fechaTerminacionAnticipada,
      ctsRepository,
      transaction
    );

    console.log('ctsTrunca',ctsTrunca);
    // Calcular Planilla mensual trunca

    const fecha = new Date(fechaTerminacionAnticipada);

    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    const ultimoDiaDelMes = obtenerUltimoDiaDelMes(anio, mes);

    const anio_mes_dia = `${anio}-${mes}-${ultimoDiaDelMes}`;
    
    const planillaMensualTrunca = await calcularPlanillaMensualTruncaPorTrabajador(
      anio_mes_dia,
      filial_id,
      planillaRepository,
      trabajadorRepository,
      trabajador_id,
      usuario_cierre_id,
      transaction
    );
    
console.log('planillaMensualTrunca',planillaMensualTrunca);

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
