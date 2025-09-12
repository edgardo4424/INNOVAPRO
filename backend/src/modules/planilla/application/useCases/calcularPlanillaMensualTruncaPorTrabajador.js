module.exports = async (
   anio_mes_dia,
   filial_id,
   planillaRepository,
   trabajadorRepository,
   trabajador_id
) => {
   const fin_mes = anio_mes_dia;

   const trabajadorData = await trabajadorRepository.obtenerTrabajadorPorId(
      trabajador_id
   );

   const payload = {
      planilla: [],
      honorarios: [],
   };

   const inicio_mes = `${anio_mes_dia.slice(0, -2)}01`;

   const t = trabajadorData;
   // 1. Filtrar contratos en rango del mes
   const contratosEnRango = t.contratos_laborales.filter((c) => {
      return (
         c.fecha_fin >= inicio_mes &&
         c.fecha_inicio <= fin_mes &&
         c.filial_id == filial_id
      );
   });

   if (contratosEnRango.length === 0) {
      return {
         codigo: 400,
         respuesta: {
            mensaje: "El trabajdor no tiene contratos ",
         },
      };
   }

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
      const res = await planillaRepository.obtenerPlanillaMensualPorTrabajador(
         anio_mes_dia,
         t.id,
         filial_id
      );
      payload.planilla.push(res);
   }

   if (contratoSeleccionadoHonorarios) {
      const res =
         await planillaRepository.calcularPlanillaMensualPorTrabajadorRXH(
            anio_mes_dia,
            t.id,
            filial_id
         );
      payload.honorarios.push(res);
   }

   return {
      codigo: 202,
      respuesta: {
         mensaje: "Se obtuvo correctamente la planilla mensua Trunca.",
         payload,
      },
   };
};
