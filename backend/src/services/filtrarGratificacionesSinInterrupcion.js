const filtrarGratificacionesSinInterrupcion = (gratificaciones) => {
   gratificaciones.sort(
      (a, b) => new Date(a.fecha_ingreso) - new Date(b.fecha_ingreso)
   );
   
   let resultado = [];
   for (let i = 0; i < gratificaciones.length; i++) {
      const actual = gratificaciones[i];
      const siguiente = gratificaciones[i + 1];
      if (siguiente) {
         const finActual = new Date(actual.fecha_fin);
         const inicioSiguiente = new Date(siguiente.fecha_ingreso);

         // Diferencia en días
         const diffDias = (inicioSiguiente - finActual) / (1000 * 60 * 60 * 24);

         if (diffDias > 1) {
            // si hay hueco mayor a 1 día, limpiar el arreglo y continuar el bule
            resultado = [];
            continue;
         }
      }

      // si no hay siguiente o no hay hueco > 1 día, conservar
      resultado.push(actual);
   }

   return resultado;
};
module.exports=filtrarGratificacionesSinInterrupcion