module.exports = async (
   periodo,
   anio,
   filial_id,
   array_cts,
   ctsRepository,
   usuario_cierre_id
) => {
   let periodoObtenido;
   switch (periodo) {
      case "MAYO":
         periodoObtenido = `${anio}-04`;
         break;
      case "NOVIEMBRE":
         periodoObtenido = `${anio}-11`;
         break;
      default:
         break;
   }
   const verificar_cierre_cts = await ctsRepository.verificarCierrePeriodoCts(
      periodo,
      anio,
      filial_id
   );
   if (verificar_cierre_cts && verificar_cierre_cts.locked_at) {
      console.log("Registro cerrado");

      return {
         codigo: 400,
         respuesta: {
            mensaje:
               "No se puede procesar la solicitud: el registro de CTS ya está cerrado.",
         },
      };
   }
   let cierre_cts;
   if (verificar_cierre_cts) {
      cierre_cts = verificar_cierre_cts;
      console.log("Ya existia el registro de cierre de cts: ", cierre_cts);
   } else {
      const payload = {
         filial_id: filial_id,
         periodo: periodoObtenido,
         usuario_cierre_id,
      };
      cierre_cts = await ctsRepository.generarRegistroCierrePeriodoCts(payload);
      console.log(
         "se entro a genrar el registro de cierre de cts: ",
         cierre_cts
      );
   }

   const hoy = new Date();
   const transform_data = array_cts.map((c) => {
      let data = { ...c };
      data.locked_at = hoy;
      data.usuario_cierre_id = usuario_cierre_id;
      data.filial_id = filial_id;
      data.cierre_id = cierre_cts.id;
      data.periodo = periodoObtenido;
      return data;
   });

   console.log("dara Tranaformada: ", transform_data);

   let cts_creadas = [];
   for (const c of transform_data) {
      const response_cts_create = await ctsRepository.crearRegistroCts(c);
      cts_creadas.push(response_cts_create);
   }
   const locked = new Date();
   const generar_bloqueo_cts =
      await ctsRepository.generarCierreBloqueoPeriodoCts(locked, cierre_cts.id);

   console.log("Bloqueo genrado", generar_bloqueo_cts);

   return {
      codigo: 201,
      respuesta: {
         mensaje: "Las cts fueron registradas exitosamente.",
         cts: cts_creadas,
      },
   };
};
