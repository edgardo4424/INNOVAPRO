module.exports = async (id, bonoRepository, transaction = null) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: { mensaje: "El id del bono no es válido" },
      };
   }
   await bonoRepository.eliminarBonoPorId(id, transaction);
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Bonos eliminado exitosamente",
      },
   };
};
