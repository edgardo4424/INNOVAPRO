module.exports = async (periodo, anio, filial_id, ctsRepository) => {    
   const registros_cts = await ctsRepository.obtenerHistoricoCts(
      periodo,
      anio,
      filial_id
   );
   return {
      codigo: 200,
      respuesta: {
         mensaje: "Se obtuvo correctamnete los registros historicos de cts",
         cts: registros_cts,
      },
   };
};
