const obtenerUltimoDiaLaboral = (anio, mes) => {
   // Obtener último día del mes (día 0 del siguiente mes)
   let fecha = new Date(anio, mes, 0);

   // Retroceder hasta que sea lunes a viernes (1 a 5)
   while (fecha.getDay() === 0 || fecha.getDay() === 6) {
      fecha.setDate(fecha.getDate() - 1);
   }

   // Retornar solo el número del día (1 a 31)
   return fecha.getDate();
};

module.exports = obtenerUltimoDiaLaboral;
