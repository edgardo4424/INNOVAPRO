
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


module.exports = async function darBajaTrabajador(dataBody) {
  const transaction = await sequelize.transaction();

  const {
    baja_trabajador_id
  } = dataBody;

  // console.log("dataBody", dataBody);

  try {
    //! Obtener la informacion del trabajador que se dio de baja
    
    
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
