const calculaPromedioBonos = (bonos,meses_computados) => {
   const objBonosPorMeses = new Map();
   for (const b of bonos) {
      const mes = b.fecha.substring(5, 7);
      if (!objBonosPorMeses.has(mes)) {
         objBonosPorMeses.set(mes, { bonos: [] });
      }
      objBonosPorMeses.get(mes).bonos.push(b);
   }
   if (objBonosPorMeses.size < 3) return null;
   console.log("Meses de acumulacion: ", objBonosPorMeses.size);
   let sumatoriaBonos = 0;
   for (const b of bonos) {
      sumatoriaBonos += Number(b.monto);
   }
   console.log("sumatoria de bonos", sumatoriaBonos);
   const promedioBonosCts = sumatoriaBonos / meses_computados;
   console.log('BoNOS: ',parseFloat(promedioBonosCts.toFixed(2)));
   
   return parseFloat(promedioBonosCts.toFixed(2));
};

module.exports = calculaPromedioBonos;
