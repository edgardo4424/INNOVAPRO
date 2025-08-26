const calcularBonosEnCts = (bonos, meses_computados) => {
   let sumatoriaBonos = 0;
   for (const b of bonos) {
      sumatoriaBonos += Number(b.monto);
   }
   const promedioBonosCts = sumatoriaBonos / meses_computados;
   return parseFloat(promedioBonosCts.toFixed(2));
};

module.exports = calcularBonosEnCts;
