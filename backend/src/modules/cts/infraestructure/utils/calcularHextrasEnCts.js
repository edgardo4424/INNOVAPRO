const calcularHextrasEnCts = (
   asistencias,
   valor_hora_extra,
   meses_computados
) => {
   let sumatoriaHE = 0;
   for (const a of asistencias) {
      const calculo_monto = Number(a.horas_extras) * valor_hora_extra;
      4;

      sumatoriaHE += Number(calculo_monto);
   }
   const promedioHorasExtras = sumatoriaHE / meses_computados;

   return parseFloat(promedioHorasExtras.toFixed(2));
};

module.exports = calcularHextrasEnCts;
