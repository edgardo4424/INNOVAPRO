const sequelize = require("../../config/db");
const crearContratoLaboral = require("../../modules/contratos_laborales/application/useCases/crearContratoLaboral");
const editarContratoLaboral = require("../../modules/contratos_laborales/application/useCases/editarContratoLaboral");
const eliminarContratoLaboralPorId = require("../../modules/contratos_laborales/application/useCases/eliminarContratoLaboralPorId");
const obtenerContratosPorTrabajadorId = require("../../modules/contratos_laborales/application/useCases/obtenerContratosPorTrabajadorId");
const SequelizeContratoLaboralRepository = require("../../modules/contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");

const editarTrabajador = require("../../modules/trabajadores/application/useCases/editarTrabajador");
const SequelizeTrabajadorRepository = require("../../modules/trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");

const contratoLaboralRepository = new SequelizeContratoLaboralRepository();
const trabajadorRepository = new SequelizeTrabajadorRepository();
module.exports = async function editarTrabajadorConContrato(data) {
   const transaction = await sequelize.transaction();
   const { id: trabajadorId, contratos_laborales } = data;
 
   try {
      const response_edit = await editarTrabajador(
         data,
         trabajadorRepository,
         transaction
      ); 
       
      if (response_edit.codigo !== 201) {
         throw new Error(response_edit.respuesta.mensaje);
      }

      const contratosFront = contratos_laborales ?? [];
      const res = await obtenerContratosPorTrabajadorId(
         trabajadorId,
         contratoLaboralRepository,
         transaction
      );
      const contratosDb = res.respuesta.contratos;
      const contratosBdIds = new Set(contratosDb.map((c) => String(c.id)));
      const contratosFrontIds = new Set(
         contratosFront.map((c) => String(c.id))
      );
      const contratos_crear = [];
      const contratos_actualizar = [];
      const contratos_eliminar = [];
    
      
      for (const contrato of contratosFront) {
         if (contratosBdIds.has(String(contrato.id))) {
            contratos_actualizar.push(contrato);
         } else {
            contratos_crear.push(contrato);
         }
      }


      for (const contrato of contratosDb) {
         if (!contratosFrontIds.has(String(contrato.id))) {
            contratos_eliminar.push(contrato);
         }
      }
      for (const contrato of contratos_crear) {
         contrato.trabajador_id = Number(trabajadorId);
         const response = await crearContratoLaboral(
            contrato,
            contratoLaboralRepository,
            transaction
         );
         if (response.codigo !== 201) {
            throw new Error("Error al crear comtrato");
         }
      }
  
      for (const contrato of contratos_actualizar) {
         const response = await editarContratoLaboral(
            contrato,
            contratoLaboralRepository,
            transaction
         );
         if (response.codigo !== 200) {
            throw new Error("Error al Editar el contrato");
         }
      }
  
      for (const contrato of contratos_eliminar) {
         const response = await eliminarContratoLaboralPorId(
            contrato.id,
            contratoLaboralRepository,
            transaction
         );
         if (response.codigo !== 200) {
            throw new Error("Error al crear comtrato");
         }
      }
  
      await transaction.commit();

      return {
         codigo: 200,
         respuesta: {
            mensaje: "Trabajador y contratos actualizados exitosamente",
         },
      };
   } catch (error) {
      await transaction.rollback();
      return {
         codigo: 500,
         respuesta: {
            mensaje: "Error Inesperado: " + error,
         },
      };
   }
};
