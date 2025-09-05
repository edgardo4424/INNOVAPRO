const editarContratoLaboral = require("../../modules/contratos_laborales/application/useCases/editarContratoLaboral");

const cierreGratificacionTruncaPorTrabajador = require("../../modules/gratificaciones/application/useCases/cierreGratificacionTruncaPorTrabajador");

const SequelizeGratificacionRepository = require("../../modules/gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");

const gratificacionRepository = new SequelizeGratificacionRepository();

const SequelizeDarBajaTrabajadorRepository = require("../../modules/dar_baja_trabajador/infrastructure/repositories/sequelizeDarBajaTrabajadorRepository");

const darBajaTrabajadorRepository = new SequelizeDarBajaTrabajadorRepository();


const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const db = require("../../database/models");
const sequelize = require("../../database/sequelize");
const InsertarRegistroBajaTrabajador = require("../../modules/dar_baja_trabajador/application/useCases/InsertarRegistroBajaTrabajador");

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
    contratoLaboralEncontrado.fecha_terminacion_anticipada = fecha_baja;

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
      fecha_baja,
      gratificacionRepository,
      transaction
    );

    console.log("gratificacionTrunca", gratificacionTrunca);

    if (gratificacionTrunca.codigo == 400) {
      await transaction.rollback();
      return {
        codigo: gratificacionTrunca.codigo,
        respuesta: gratificacionTrunca.respuesta,
      };
    }

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
