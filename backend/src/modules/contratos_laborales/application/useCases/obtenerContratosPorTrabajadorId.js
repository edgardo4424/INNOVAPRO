module.exports = async (id, contratoLaboralRepository, transaction = null) => {
   if (!id) {
      return {
         codigo: 404,
         respuesta: "Los datos enviado no son correctos",
      };
   }
   const contratos =
      await contratoLaboralRepository.obtenerContratosPorTrabajadorId(
         id,
         transaction
      );   
   return {
      codigo: 202,
      respuesta: {
         mensaje: "Contratos obtenidos",
         contratos: contratos,
      },
   };
};
