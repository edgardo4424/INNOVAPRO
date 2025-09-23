import { contarDiasLaborables } from "./dias_laborales_en_rango";
import { contarDiasLaborablesDelMes } from "./dias_laborales_mes";
import { sumarMeses } from "./sumar_meses";

export const calcularDiasGenerados = (contratos) => {
   const hoy = new Date();
   let total_gozadas = 0;
   let total_vendibles = 0;
   for (const contrato of contratos) {
      const inicio = new Date(contrato.fecha_inicio);
      const fin = new Date(contrato.fecha_fin);
      const fechaFin = fin > hoy ? hoy : fin;
      const meses = [];
      let actual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
      while (actual <= fechaFin) {
         meses.push(new Date(actual));
         actual = sumarMeses(actual, 1);
      }
      for (const inicioMes of meses) {
         const anio = inicioMes.getFullYear();
         const mes = inicioMes.getMonth();
         const finMes = new Date(anio, mes + 1, 0);
         const diasLaborablesTotales = contarDiasLaborablesDelMes(anio, mes);

         const inicioReal = inicioMes < inicio ? inicio : inicioMes;
         const finReal = finMes > fechaFin ? fechaFin : finMes;
         const diasTrabajados = contarDiasLaborables(inicioReal, finReal);

         const tasaVacaciones = contrato.regimen === "MYPE" ? 1.25 : 2.5;
         const tasaVendibles = contrato.regimen === "MYPE" ? 8 / 12 : 1.25;

         const proporcionVacaciones =
            (diasTrabajados / diasLaborablesTotales) * tasaVacaciones;
         const proporcionVendibles =
            (diasTrabajados / diasLaborablesTotales) * tasaVendibles;
         total_gozadas += proporcionVacaciones;
         total_vendibles += proporcionVendibles;
      }
   }
   console.log(total_vendibles);
   
   return{
    total_gozadas,
    total_vendibles,
    maximo_disponible:total_gozadas
   };
};
