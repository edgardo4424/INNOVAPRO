
export const calculo_aportes_trabajador = (planillas = []) => {

   let sumatoria_sueldo_basico=0
   let sumatoria_sueldo_mensual = 0;
   let sumatoria_sueldo_bruto = 0;
   let sumatoria_sueldo_neto = 0;
   let sumatoria_saldo_por_pagar = 0;
   let sumatoria_essalud = 0;
   let sumatoria_vida_ley = 0;
   let sumatoria_sctr_salud = 0;
   let sumatoria_sctr_pension = 0;

   for (const p of planillas) {
      sumatoria_sueldo_basico += Number(p.sueldo_basico);
      sumatoria_sueldo_mensual += Number(p.sueldo_del_mes);
      sumatoria_sueldo_bruto += Number(p.sueldo_bruto);
      sumatoria_sueldo_neto += Number(p.sueldo_neto);
      sumatoria_saldo_por_pagar += Number(p.saldo_por_pagar);
      sumatoria_essalud += Number(p.essalud);
      sumatoria_vida_ley += Number(p.seguro_vida_ley);
      sumatoria_sctr_salud += Number(p.sctr_salud);
      sumatoria_sctr_pension += Number(p.sctr_pension);
   }

   return {
      datos_totales: {
         sumatoria_sueldo_basico,
         sumatoria_sueldo_mensual,
         sumatoria_sueldo_bruto,
         sumatoria_sueldo_neto,
         sumatoria_saldo_por_pagar,
         sumatoria_essalud,
         sumatoria_vida_ley,
         sumatoria_sctr_salud,
         sumatoria_sctr_pension,
      },
   };
};
