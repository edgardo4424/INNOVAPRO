//Recibe una arreglo de trabajadores en en planilla, y sus importes
//Devuele dos datos los calculos de essakud, seguro vida, las sctr por trabajador
// y tmabien devuelve un objeto con los calculos totales de alguna columnas
const calculo_aportes_totales_planilla = (planillas = [], importes) => {
   let seguro_vida = 0;
   let sctr_salud = 0;
   let sctr_pension = 0;
   let sumatoria_sueldo_basico = 0;

   for (const importe of importes) {
      if (importe.codigo.includes("seguro_vida")) {
         seguro_vida = importe.valor;
      }
      if (importe.codigo.includes("sctr_salud")) {
         sctr_salud = importe.valor;
      }
      if (importe.codigo.includes("sctr_pension")) {
         sctr_pension = importe.valor;
      }
   }
   for (const p of planillas) {
      sumatoria_sueldo_basico += Number(p.sueldo_basico);
   }

   let recalculo_planillas = planillas.map((p) => {
      let porc = ((p.sueldo_basico / sumatoria_sueldo_basico) * 100) / 100;
      porc = parseFloat(porc.toFixed(11));
      let data = {
         ...p,
         essalud: p.sueldo_bruto * 0.09,
         seguro_vida_ley: porc * seguro_vida,
         sctr_salud: porc * sctr_salud,
         sctr_pension: porc * sctr_pension,
      };
      return data;
   });

   let sumatoria_sueldo_mensual = 0;
   let sumatoria_sueldo_bruto = 0;
   let sumatoria_sueldo_neto = 0;
   let sumatoria_saldo_por_pagar = 0;
   let sumatoria_essalud = 0;
   let sumatoria_vida_ley = 0;
   let sumatoria_sctr_salud = 0;
   let sumatoria_sctr_pension = 0;

   for (const p of recalculo_planillas) {
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
      recalculo_planillas,
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

module.exports=calculo_aportes_totales_planilla