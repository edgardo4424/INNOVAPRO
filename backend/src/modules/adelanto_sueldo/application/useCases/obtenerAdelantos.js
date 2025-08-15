module.exports = async (adelantoSueldoRepository, transaction = null) => {
   const adelantos = await adelantoSueldoRepository.obtenerAdelantosSueldo(
      transaction
   );
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Adelantos de sueldo encontrados",
         adelantos_sueldo: adelantos,
      },
   };
};
