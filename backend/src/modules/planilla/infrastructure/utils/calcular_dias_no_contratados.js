//! Esta funcion calculara los dias que no estubo contratado el empleados
const calcularDiasNoContratado = (
   inicio_real,
   fin_real,
   inicio_de_mes,
   fin_de_mes
) => {
   let dias_contratados = 0;

   if (fin_real >= inicio_real) {
      dias_contratados =
         Math.floor(
            (new Date(fin_real) - new Date(inicio_real)) / (1000 * 60 * 60 * 24)
         ) + 1;
   } else {
      return 0;
   }

   // Calcular total de días en el rango general

   let total_dias_rango =
      Math.floor(
         (new Date(fin_de_mes) - new Date(inicio_de_mes)) /
            (1000 * 60 * 60 * 24)
      ) + 1;
   // Días no contratados (no laborados)

   return total_dias_rango - dias_contratados;
};

module.exports = calcularDiasNoContratado;
