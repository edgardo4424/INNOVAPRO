module.exports = async (
   anio_mes_dia,
   filial_id,
   planillaRepository,
   trabajadorRepository
) => {
   const hoy = new Date().toISOString().slice(0, 10);
   const fin_mes = anio_mes_dia; // supondremos que viene como 'YYYY-MM-DD'

   const trabajadoresData =
      await trabajadorRepository.obtenerTrabajadoresYcontratos();

   const payload = {
      planilla: { trabajadores: [] },
      honorarios: { trabajadores: [] },
   };

   const inicio_mes = `${anio_mes_dia.slice(0, -2)}01`;   

   for (const t of trabajadoresData) {
      // 1. Filtrar contratos en rango del mes
      const contratosEnRango = t.contratos_laborales.filter((c) => {
         return (
            c.fecha_fin >= inicio_mes && c.fecha_inicio <= fin_mes &&
            c.filial_id == filial_id
         );
      });

      if (contratosEnRango.length === 0) continue;

      // 2. Separar contratos por tipo
      const contratosPlanilla = contratosEnRango.filter(
         (c) => c.tipo_contrato === "PLANILLA"
      );
      const contratosHonorarios = contratosEnRango.filter(
         (c) => c.tipo_contrato === "HONORARIOS"
      );


      let contratoSeleccionadoPlanilla = null;
      let contratoSeleccionadoHonorarios = null;

      // 3. Si hay más de uno, dejar el más reciente (por fecha_inicio)
      if (contratosPlanilla.length > 1) {
         contratoSeleccionadoPlanilla = contratosPlanilla.reduce((a, b) =>
            new Date(a.fecha_inicio) > new Date(b.fecha_inicio) ? a : b
         );
      } else if (contratosPlanilla.length === 1) {
         contratoSeleccionadoPlanilla = contratosPlanilla[0];
      }

      if (contratosHonorarios.length > 1) {
         contratoSeleccionadoHonorarios = contratosHonorarios.reduce((a, b) =>
            new Date(a.fecha_inicio) > new Date(b.fecha_inicio) ? a : b
         );
      } else if (contratosHonorarios.length === 1) {
         contratoSeleccionadoHonorarios = contratosHonorarios[0];
      }


      // 4. Devolver uno de cada uno si existen
      if (contratoSeleccionadoPlanilla) {         
         const res =
            await planillaRepository.obtenerPlanillaMensualPorTrabajador(
               anio_mes_dia,
               t.id,
               filial_id
            );
         // console.log('Repsuesta del planila mensual: ',res);
         // console.log("||");
         // console.log("||");
         // console.log("||");
         // console.log("||");
         // console.log("||");
         
         
         payload.planilla.trabajadores.push(res);
      }

      if (contratoSeleccionadoHonorarios) {
         const res =
            await planillaRepository.calcularPlanillaMensualPorTrabajadorRXH(
               anio_mes_dia,
               t.id,
               filial_id
            );
         payload.honorarios.trabajadores.push(res);
      }
   }

   return {
      codigo: 202,
      respuesta: {
         mensaje: "Se obtuvo correctamente la planilla mensual.",
         payload,
      },
   };
};
