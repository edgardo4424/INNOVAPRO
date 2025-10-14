module.exports = async (
   ctsRepository,
   periodo,
   anio,
   filial_id,
   trabajador_id,
   transaction = null
) => {
   const cts = await ctsRepository.obtenerCtsPorTrabajador(
      periodo,
      anio,
      filial_id,
      trabajador_id,
      transaction
   );
   return {
      codigo: 203,
      respuesta: {
         cts: cts,
      },
   };
};
