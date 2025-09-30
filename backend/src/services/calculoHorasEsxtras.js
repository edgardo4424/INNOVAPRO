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
   if (objAsistenciasHE.size < 3) return null;

   let sumatoriaHE = 0;
   for (const a of asistencias) {
      const calculo_monto = Number(a.horas_extras) * valor_hora_extra;
      4;

      sumatoriaHE += Number(calculo_monto);
   }
   const promedioHorasExtras = sumatoriaHE / meses_computados;

   return  parseFloat(promedioHorasExtras.toFixed(2))

};

module.exports = calcularPromedioHorasExtras;
