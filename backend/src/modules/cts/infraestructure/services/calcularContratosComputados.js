
const calcularContratosComputados = (
   fechaInicioRango,
   fechaFinRango,
   objetos
) => {
   //Retorna los contratos que se encuentran dentro del periodo de la cts
   let filtrados = objetos.filter((obj) => {
      const inicio = obj.fecha_inicio;
      const fin = obj.fecha_fin;

      return (
         (inicio >= fechaInicioRango && inicio <= fechaFinRango) ||
         (fin >= fechaInicioRango && fin <= fechaFinRango) ||
         (inicio <= fechaInicioRango && fin >= fechaFinRango)
      );
   });

   filtrados.sort(
      (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
   );

   // Paso 3: recorrer y quitar los que tengan un hueco > 1 día con el siguiente
   let resultado = [];
   for (let i = 0; i < filtrados.length; i++) {
      const actual = filtrados[i];
      const siguiente = filtrados[i + 1];

      if (siguiente) {
         const finActual = new Date(actual.fecha_fin);
         const inicioSiguiente = new Date(siguiente.fecha_inicio);

         // diferencia en días
         const diffDias = (inicioSiguiente - finActual) / (1000 * 60 * 60 * 24);

         if (diffDias > 1) {
            // si hay hueco mayor a 1 día, limpiar el arreglo y continuar el bule
            resultado=[];
            continue;
         }
      }

      // si no hay siguiente o no hay hueco > 1 día, conservar
      resultado.push(actual);
   }

   return resultado;
};

module.exports = calcularContratosComputados;
