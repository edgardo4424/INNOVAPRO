module.exports = async (id, contratoLaboralRepository, transaction = null) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: { mensaje: "El id del Contrato no es válido" },
      };
   }
   await contratoLaboralRepository.eliminarContratoPorId(id, transaction);
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Contrato eliminado exitosamente",
      },
   };
};
