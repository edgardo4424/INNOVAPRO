module.exports = async (id, adelantoSueldoRepository, transaction = null) => {
   
    if (!id) {
      return {
         codigo: 400,
         respuesta: { mensaje: "El id del adelanto no es válido" },
      };
   }
   await adelantoSueldoRepository.eliminarAdelantoSueldoPorId(id, transaction);
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Adelanto de sueldo eliminado exitósamente.",
      },
   };
};
