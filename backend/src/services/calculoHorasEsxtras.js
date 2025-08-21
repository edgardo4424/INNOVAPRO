const calcularPromedioHorasExtras = (
   asistencias,
   valor_hora_extra,
   meses_computados
) => {
   const objAsistenciasHE = new Map();

   for (const a of asistencias) {
      const mes = a.fecha.substring(5, 7);
      if (a.horas_extras > 0) {
         if (!objAsistenciasHE.has(mes)) {
            objAsistenciasHE.set(mes, { asistencias: [] });
         }
         objAsistenciasHE.get(mes).asistencias.push(a);
      }
   }
   console.log("Meses acumulados de HE: ", objAsistenciasHE.size);
   if (objAsistenciasHE.size < 3) return null;

   let sumatoriaHE = 0;
   for (const a of asistencias) {
      const calculo_monto = Number(a.horas_extras) * valor_hora_extra;
      4;
      console.log("caculo del monto: ", calculo_monto);

      sumatoriaHE += Number(calculo_monto);
   }
   console.log("suamtoria monto de Horas Extras: ", sumatoriaHE);
   const promedioHorasExtras = sumatoriaHE / meses_computados;
   console.log(
      "Promedio monto de Horas extras: ",
      parseFloat(promedioHorasExtras.toFixed(2))
   );
};

module.exports = calcularPromedioHorasExtras;
