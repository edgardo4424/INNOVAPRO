module.exports = async (id, bonoRepository, transaction = null) => {
   if (!id) {
      return {
         codigo: 400,
         respuesta: { mensaje: "El id del trabajador no valido" },
      };
   }
   const bonos = await bonoRepository.obtenerBonosPorTrabajadorId(id, transaction);
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Bonos encontrados",
         bonos: bonos,
      },
   };
};
