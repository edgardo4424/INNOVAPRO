const conteoHextrasMeses = (
   asistencias,
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
   if (objAsistenciasHE.size < 3) return false;

   return  true
};

module.exports = conteoHextrasMeses;