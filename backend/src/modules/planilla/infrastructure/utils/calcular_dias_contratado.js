const calcularDiasContratado = (
   inicio_real,
   fin_real,
   inicio_de_mes,
   fin_de_mes
) => {
   const inicioReal = new Date(inicio_real);
   const finReal = new Date(fin_real);
   const inicioMes = new Date(inicio_de_mes);
   const finMes = new Date(fin_de_mes);

   // Determinar el inicio y fin del periodo efectivo de contratación dentro del mes
   const inicioContrato = inicioReal > inicioMes ? inicioReal : inicioMes;
   const finContrato = finReal < finMes ? finReal : finMes;

   // Si el contrato no está vigente en este mes
   if (finContrato < inicioContrato) {
      return 0;
   }

   const diasContratados =
      Math.floor((finContrato - inicioContrato) / (1000 * 60 * 60 * 24)) + 1;

   return diasContratados;
};

module.exports = calcularDiasContratado;

