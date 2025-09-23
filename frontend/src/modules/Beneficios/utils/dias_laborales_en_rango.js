//!ESTA FUNCION DEVEULEVE LOS DIAS LABORALES EN UN  RANGO
  export  const contarDiasLaborables = (inicio, fin) => {
      let contador = 0;
      const actual = new Date(inicio);
      while (actual <= fin) {
         const dia = actual.getDay();
         if (dia !== 0 && dia !== 6) contador++; // lunes a viernes
         actual.setDate(actual.getDate() + 1);
      }
      return contador;
   };