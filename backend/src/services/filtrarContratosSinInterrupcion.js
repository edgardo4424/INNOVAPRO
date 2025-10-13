const filtrarContratosSinInterrupcion = (filtrados) => {
   // Agrupar contratos por filial_id
   const contratosPorFilial = {};

   for (const contrato of filtrados) {
      const filial = contrato.filial_id;
      if (!contratosPorFilial[filial]) {
         contratosPorFilial[filial] = [];
      }
      contratosPorFilial[filial].push(contrato);
   }

   const gruposValidos = [];

   // Procesar cada grupo por filial
   for (const filial in contratosPorFilial) {
      const contratos = contratosPorFilial[filial];

      // Ordenar por fecha_inicio
      contratos.sort(
         (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
      );

      let grupoActual = [];
      let hayInterrupcion = false;

      for (let i = 0; i < contratos.length; i++) {
         const actual = contratos[i];
         const siguiente = contratos[i + 1];

         grupoActual.push(actual);

         if (siguiente) {
            const finActual = new Date(actual.fecha_fin);
            const inicioSiguiente = new Date(siguiente.fecha_inicio);

            const diffDias = (inicioSiguiente - finActual) / (1000 * 60 * 60 * 24);

            if (diffDias > 1) {
               hayInterrupcion = true;
               break; // romper si hay hueco
            }
         }
      }

      if (!hayInterrupcion) {
         gruposValidos.push(grupoActual);
      }
   }

   // Devolver todos los grupos válidos
   return gruposValidos.flat(); // aplanamos el array para que sea una lista continua de contratos
};

module.exports = filtrarContratosSinInterrupcion;
