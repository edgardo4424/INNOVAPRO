const conteoBonosMeses = (bonos) => {
   const objBonosPorMeses = new Map();
   for (const b of bonos) {
      const mes = b.fecha.substring(5, 7);
      if (!objBonosPorMeses.has(mes)) {
         objBonosPorMeses.set(mes, { bonos: [] });
      }
      objBonosPorMeses.get(mes).bonos.push(b);
   }
   if (objBonosPorMeses.size < 3) return false;

   return true
};

module.exports = conteoBonosMeses;
