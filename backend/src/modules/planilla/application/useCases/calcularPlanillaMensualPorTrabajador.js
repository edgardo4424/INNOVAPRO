module.exports = async (
   anio_mes_dia,
   filial_id,
   trabajador_id,
   planillaRepository
) => {
console.log(anio_mes_dia);

   const planillaMensual =
      await planillaRepository.calcularPlanillaMensualPorTrabajador(
         anio_mes_dia,
         filial_id,
         trabajador_id
      );

   return {
      codigo: 202,
      respuesta: {
         mensaje: "Se obtuvo correctamente la planilla mensual.",
         planillaMensual,
      },
   };
};
