
//! Se valido el funcionamiento
// Dias laborales del area de almacen y montadores de de luens a sabado 
// Resto es de lunes a viernes
const contarDiasLaborales = (fechaInicio, fechaFin, area_id) => {
   const unDiaMs = 24 * 60 * 60 * 1000;

   const inicio = new Date(fechaInicio);
   const fin = new Date(fechaFin);

   if (isNaN(inicio) || isNaN(fin)) {
      throw new Error("Fechas inválidas. Usa el formato 'YYYY-MM-DD'.");
   }

   // Asegurar orden (rango inclusivo)
   let desde = inicio < fin ? inicio : fin;
   let hasta = inicio < fin ? fin : inicio;

   let contador = 0;
   while (desde <= hasta) {          
      const diaSemana = desde.getUTCDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      if (
         (diaSemana >= 1 && diaSemana <= 5) ||
         (diaSemana === 6 && (area_id === 6 || area_id === 2))
      ) {

         contador++;
      }
      desde = new Date(desde.getTime() + unDiaMs);
   }

   return contador;
};

module.exports = contarDiasLaborales;
