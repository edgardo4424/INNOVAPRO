//!ESTA FUNCION DEVEULEVE LOS DIAS LABORALES DE UN MES ESPECIFICO

export const contarDiasLaborablesDelMes = (anio, mes) => {
   let contador = 0;
   const fecha = new Date(anio, mes, 1);
   while (fecha.getMonth() === mes) {
      const dia = fecha.getDay();
      if (dia !== 0 && dia !== 6) contador++;
      fecha.setDate(fecha.getDate() + 1);
   }
   return contador;
};
