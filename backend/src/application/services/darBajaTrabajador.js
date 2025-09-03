const sequelize = require("../../config/db");
const obtenerContratosPorTrabajadorId = require("../../modules/contratos_laborales/application/useCases/obtenerContratosPorTrabajadorId");

const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const contratoLaboralRepository = new SequelizeContratoLaboralRepository();

module.exports = async function darBajaTrabajador(trabajador_id) {
   const transaction = await sequelize.transaction();

   try {
      console.log('trabajador_id', trabajador_id);

      // Obtener los contratos del trabajador por ID
      const contratos = await obtenerContratosPorTrabajadorId(
          trabajador_id,
          contratoLaboralRepository,
          transaction
      )

      const contratosDelTrabajador = contratos.respuesta.contratos;

      if(contratosDelTrabajador.length == 0) {
         return {
            codigo: 404,
            respuesta: {
               mensaje: "No se encontraron contratos para el trabajador",
            },
         }
      }

      // Obtener los contratos vigentes hasta la fecha_baja
      

      return {
         codigo: 201,
         respuesta: {
            mensaje: "Trabajador dada de baja exitosamente",
         },
      };
   } catch (error) {
      await transaction.rollback();
      return {
         codigo: 500,
         respuesta: {
            mensaje: "Error inesperado: " + error.message,
         },
      };
   }
};
