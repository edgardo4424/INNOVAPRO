const InterseccionVacacionesPlanilla = (vacaciones, inicio, fin) => {
   const unDiaMs = 24 * 60 * 60 * 1000;
   let contador = 0;
   for (const v of vacaciones) {
      const start = v.fecha_inicio >= inicio ? v.fecha_inicio : inicio;
      const end = v.fecha_termino <= fin ? v.fecha_termino : fin;
      let i = new Date(start);
      let f = new Date(end);
      while (i <= f) {
         contador++;
         i = new Date(i.getTime() + unDiaMs);
      }      
   }
   return contador;
};

module.exports = InterseccionVacacionesPlanilla;
