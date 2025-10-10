const calcularDiasContratado = (
   inicio_real,
   fin_real,
   inicio_de_mes,
   es_indefinido
) => {
   // Extraer días como enteros
   const diaInicioContrato = parseInt(inicio_real.slice(8, 10));
   const diaInicioMes = parseInt(inicio_de_mes.slice(8, 10));
   const diaFinMes = 30;

   // Inicializamos diaFinContrato de forma segura
   let diaFinContrato;

   if (es_indefinido) {
      diaFinContrato = diaFinMes; // usar siempre día 30
   } else {
      // Validar que fin_real existe antes de intentar parsear
      if (typeof fin_real === 'string' && fin_real.length >= 10) {
         diaFinContrato = parseInt(fin_real.slice(8, 10));
      } else {
         return 0; // o manejar según lógica deseada
      }
   }



   const inicio = Math.max(diaInicioContrato, diaInicioMes);
   const fin = Math.min(diaFinContrato, diaFinMes);


   if (fin >= inicio) {
      const dias = fin - inicio + 1;
      return dias;
   }

   return 0;
};

module.exports = calcularDiasContratado;



