const SequelizeGratificacionRepository = require("../../modules/gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");
const gratificacionRepository = new SequelizeGratificacionRepository();

const SequelizeCtsRepository = require("../../modules/cts/infraestructure/repositories/sequelizeCtsRepository");
const ctsRepository = new SequelizeCtsRepository();

const SequelizePlanillaRepository = require("../../modules/planilla/infrastructure/repositories/sequelizePlanillaRepository");
const planillaRepository = new SequelizePlanillaRepository();

const SequelizeTrabajadorRepository = require("../../modules/trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const trabajadorRepository = new SequelizeTrabajadorRepository();

const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

const db = require("../../database/models");
const sequelize = require("../../database/sequelize");

module.exports = async function darBajaTrabajador(baja_trabajador_id) {
  const transaction = await sequelize.transaction();

  // console.log("dataBody", dataBody);

  try {
    //! Obtener la informacion del trabajador que se dio de baja
    console.log("baja_trabajador_id", baja_trabajador_id);

    const trabajador_dado_de_baja = await db.bajas_trabajadores.findByPk(
      baja_trabajador_id,
      {
        include: [
          {
            model: db.trabajadores,
            as: "trabajador",
          },
          {
            model: db.contratos_laborales,
            as: "contrato",
          },
        ],
        transaction,
      }
    );

    if (!trabajador_dado_de_baja) {
      await transaction.rollback();
      return {
        codigo: 404,
        respuesta: {
          mensaje: "Trabajador dado de baja no encontrado",
        },
      };
    }

    //! Obtener la filial del trabajador con el ultimo contrato id
    const contrato_laboral = await db.contratos_laborales.findOne({
      where: { id: trabajador_dado_de_baja.contrato_id },
      include: [
        {
          model: db.empresas_proveedoras,
          as: "empresa_proveedora",
        },
      ],
      transaction,
    });

    if (!contrato_laboral) {
      await transaction.rollback();
      return {
        codigo: 404,
        respuesta: {
          mensaje: "Contrato laboral no encontrado",
        },
      };
    }

    //! Obtener la gratificacion trunca del trabajador

    let gratificacionTrunca = null;

    if (trabajador_dado_de_baja.gratificacion_trunca_id) {
      gratificacionTrunca = await db.gratificaciones.findByPk(
        trabajador_dado_de_baja.gratificacion_trunca_id,
        {
          transaction,
        }
      );
    }

    //! Obtener la cts trunca del trabajador
    let ctsTrunca = null;

    if (trabajador_dado_de_baja.cts_trunca_id) {
       ctsTrunca = await db.cts.findByPk(
        trabajador_dado_de_baja.cts_trunca_id,
        {
          transaction,
        }
      );
    }

    //! Obtener la planilla del trabajador
    let planillaMensualTrunca = null;

    if (trabajador_dado_de_baja.planilla_mensual_trunca_id) {
      planillaMensualTrunca = await db.planilla_mensual.findByPk(
        trabajador_dado_de_baja.planilla_mensual_trunca_id,
        {
          transaction,
        }
      );
    }

    const { trabajador, ...resto } = trabajador_dado_de_baja.dataValues;

    const respuesta_detalle_liquidacion = {
      id: resto.id,
      contrato_id: resto.contrato_id,
      fecha_baja: resto.fecha_baja,
      motivo: resto.motivo,
      observacion: resto.observacion,
      estado_liquidacion: resto.estado_liquidacion,
      tiempo_laborado: {
        anios: resto.tiempo_laborado_anios,
        meses: resto.tiempo_laborado_meses,
        dias: resto.tiempo_laborado_dias,
      },
      tiempo_computado: { // tiempo del ultimo contrato vigente
        anios: resto.tiempo_computado_anios,
        meses: resto.tiempo_computado_meses,
        dias: resto.tiempo_computado_dias,
      },
    };
    

    const respuesta = {

      trabajador: trabajador_dado_de_baja.trabajador,

      filial: {
        id: contrato_laboral.empresa_proveedora.id,
        nombre: contrato_laboral.empresa_proveedora.razon_social,
        ruc: contrato_laboral.empresa_proveedora.ruc,
        direccion: contrato_laboral.empresa_proveedora.direccion,
      },

      detalle_liquidacion: respuesta_detalle_liquidacion,
      gratificacion: gratificacionTrunca,
      cts: ctsTrunca,
      planilla_mensual: planillaMensualTrunca
    };

    await transaction.commit();
    return {
      codigo: 200,
      respuesta: {
        mensaje: "Liquidación del trabajador",
        liquidacion: respuesta,
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
