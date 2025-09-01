module.exports = async (
   anio_mes_dia,
   filial_id,
   planillaRepository,
   trabajadorRepository
) => {
   console.log(anio_mes_dia);

   const hoy = new Date().toISOString().slice(0, 10);
   const responsetrab =
      await trabajadorRepository.obtenerTrabajadoresYcontratos();

   const payload = {
      planilla: {
         trabajadores: [],
      },
      honorarios: {
         trabajadores: [],
      },
   };
   const trabajadores = responsetrab
      .map((t) => {
         const contratoActual = t.contratos_laborales.find((c) => {
            return hoy >= c.fecha_inicio && hoy <= c.fecha_fin;
         });

         if (!contratoActual) return null;
         if (contratoActual.filial_id == filial_id) {
            return {
               ...t,
               contrato_actual: contratoActual,
            };
         }
         return null;
      })
      .filter((t) => t !== null);

   for (const t of trabajadores) {
      // console.log(t.id);
      if (t.contrato_actual.tipo_contrato == "PLANILLA") {
         const res =
            await planillaRepository.calcularPlanillaMensualPorTrabajador(
               anio_mes_dia,
               t.id
            );
         payload.planilla.trabajadores.push(res)
         console.log("respuesta del sequelize planilla", res);
      }
      if (t.contrato_actual.tipo_contrato == "HONORARIOS") {
         const res =
            await planillaRepository.calcularPlanillaMensualPorTrabajadorRXH(
               anio_mes_dia,
               t.id
            );
                     payload.honorarios.trabajadores.push(res)

         console.log("respuesta del sequelize Honorarios: ", res);
      }
   }

   // const planillaMensual =
   //    await planillaRepository.calcularPlanillaMensualPorTrabajador(
   //       anio_mes_dia,
   //       filial_id,
   //       trabajador_id
   //    );

   return {
      codigo: 202,
      respuesta: {
         mensaje: "Se obtuvo correctamente la planilla mensual.",
         payload,
      },
   };
};
