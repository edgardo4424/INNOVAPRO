const sequelize = require("../../config/db");
const crearContratoLaboral = require("../../modules/contratos_laborales/application/useCases/crearContratoLaboral");
const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const crearTrabajador = require("../../modules/trabajadores/application/useCases/crearTrabajador");
const SequelizeTrabajadorRepository = require("../../modules/trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");

const contratoLaboralRepository = new SequelizeContratoLaboralRepository();
const trabajadorRepository = new SequelizeTrabajadorRepository();

module.exports = async function registrarTrabajadorConContrato(data) {
   const transaction = await sequelize.transaction();

   try {
      // 1. Crear trabajador
      const resultadoTrabajador = await crearTrabajador(
         data,
         trabajadorRepository,
         transaction
      );

      if (resultadoTrabajador.codigo !== 201) {
         await transaction.rollback();
         return {
            codigo: 400,
            respuesta: {
               mensaje:
                  resultadoTrabajador.respuesta?.mensaje ||
                  "Error al crear trabajador",
            },
         };
      }
      const trabajador_id = resultadoTrabajador.respuesta.trabajador.id;
      if (!trabajador_id) {
         await transaction.rollback();
      }
      const contratosCreados = [];
      for (const contratoData of data.contratos_laborales || []) {
         // Asociar el contrato al trabajador recién creado
         contratoData.trabajador_id = trabajador_id;

         const resultadoContrato = await crearContratoLaboral(
            contratoData,
            contratoLaboralRepository,
            transaction
         );

         if (resultadoContrato.codigo !== 201) {
            await transaction.rollback();
            return {
               codigo: 400,
               respuesta: {
                  mensaje:
                     resultadoContrato.respuesta?.mensaje ||
                     "Error al crear contrato laboral",
               },
            };
         }

         contratosCreados.push(resultadoContrato.respuesta.contratoLaboral); // o contrato
      }

      await transaction.commit();

      return {
         codigo: 201,
         respuesta: {
            mensaje: "Trabajador y contratos creados exitosamente",
            resultadoTrabajador,
            contratos: contratosCreados,
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
