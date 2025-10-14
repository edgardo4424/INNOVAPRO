module.exports = async (bonoRepository, transaction = null) => {
   const bonos = await bonoRepository.obtenerBonos(transaction);
   return {
      codigo: 201,
      respuesta: {
         mensaje: "Bonos encontrados",
         bonos: bonos,
      },
   };
};
