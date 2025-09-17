const calcularEdad = require("./cacular_edad");
const { trabajador_planilla_model } = require("./trabajador_planilla_model");

const unir_planillas_mensuales = (
   planillas_obtenidas = [],
   trabajador,
   PORCENTAJE_DESCUENTO_ONP,
   PORCENTAJE_DESCUENTO_AFP,
   PORCENTAJE_DESCUENTO_SEGURO
) => {
   const grupo_planilla = trabajador_planilla_model();
   grupo_planilla.info_detalle = planillas_obtenidas;
   // if(trabajador.id==7)console.log('La edad de valeri es',trabajador);
   
   for (const p of planillas_obtenidas) {
      grupo_planilla.trabajador_id = p.trabajador_id;
      grupo_planilla.contrato_id = p.contrato_id;
      grupo_planilla.tipo_contrato = p.tipo_contrato;
      grupo_planilla.regimen = p.regimen;
      grupo_planilla.periodo = p.periodo;
      grupo_planilla.tipo_documento = p.tipo_documento;
      grupo_planilla.numero_documento = p.numero_documento;
      grupo_planilla.nombres_apellidos = p.nombres_apellidos;
      grupo_planilla.area = p.area;
      grupo_planilla.afp = p.afp;
      grupo_planilla.fecha_ingreso = p.fecha_ingreso;
      grupo_planilla.dias_labor += Number(p.dias_labor);
      grupo_planilla.sueldo_basico = Number(p.sueldo_basico);
      grupo_planilla.sueldo_del_mes += Number(p.sueldo_del_mes);
      grupo_planilla.asig_fam = Number(p.asig_fam);
      grupo_planilla.descanso_medico += Number(p.descanso_medico);
      grupo_planilla.licencia_con_goce_de_haber += Number(
         p.licencia_con_goce_de_haber
      );
      grupo_planilla.licencia_sin_goce_de_haber += Number(
         p.licencia_sin_goce_de_haber
      );
      grupo_planilla.vacaciones += Number(p.vacaciones);
      grupo_planilla.vacaciones_vendidas += Number(p.vacaciones_vendidas);
      grupo_planilla.gratificacion = Number(p.gratificacion);
      grupo_planilla.cts = Number(p.cts);
      grupo_planilla.h_extras_primera_quincena += Number(
         p.h_extras_primera_quincena
      );
      grupo_planilla.h_extras_segunda_quincena += Number(
         p.h_extras_segunda_quincena
      );
      grupo_planilla.faltas_primera_quincena += Number(
         p.faltas_primera_quincena
      );
      grupo_planilla.faltas_segunda_quincena += Number(
         p.faltas_segunda_quincena
      );
      grupo_planilla.tardanza_primera_quincena += Number(
         p.tardanza_primera_quincena
      );
      grupo_planilla.tardanza_segunda_quincena += Number(
         p.tardanza_segunda_quincena
      );
      grupo_planilla.bono_primera_quincena += Number(p.bono_primera_quincena);
      grupo_planilla.bono_segunda_quincena += Number(p.bono_segunda_quincena);
      // grupo_planilla.sueldos_brutos_obtenidos.push(Number(p.sueldo_bruto));
      grupo_planilla.quinta_categoria = Number(p.quinta_categoria);
      grupo_planilla.sueldo_quincenal = Number(p.sueldo_quincenal);
      grupo_planilla.adelanto_prestamo += Number(p.adelanto_prestamo);

      grupo_planilla.filial_id = p.filial_id;
      grupo_planilla.banco = p.banco;
      grupo_planilla.numero_cuenta = p.numero_cuenta;
   }

   grupo_planilla.sueldo_bruto = Number(
      (
         Number(grupo_planilla.sueldo_del_mes) +
         Number(grupo_planilla.asig_fam) +
         Number(grupo_planilla.descanso_medico) +
         Number(grupo_planilla.licencia_con_goce_de_haber) +
         Number(grupo_planilla.licencia_sin_goce_de_haber) * -1 +
         Number(grupo_planilla.vacaciones) +
         Number(grupo_planilla.vacaciones_vendidas) +
         Number(grupo_planilla.h_extras_primera_quincena) +
         Number(grupo_planilla.h_extras_segunda_quincena) +
         Number(grupo_planilla.faltas_primera_quincena) * -1 +
         Number(grupo_planilla.faltas_segunda_quincena) * -1 +
         Number(grupo_planilla.bono_primera_quincena) +
         Number(grupo_planilla.bono_segunda_quincena)
      ).toFixed(2)
   );

   if (trabajador.sistema_pension === "ONP") {
      grupo_planilla.onp = (
         grupo_planilla.sueldo_bruto *
         (PORCENTAJE_DESCUENTO_ONP / 100 )
      ).toFixed(2);
   }
   if (trabajador.sistema_pension === "AFP") {
      grupo_planilla.afp_ap_oblig = (
         grupo_planilla.sueldo_bruto *
         (PORCENTAJE_DESCUENTO_AFP / 100 )
      ).toFixed(2);
         grupo_planilla.seguro =
      Number(grupo_planilla.sueldo_bruto) * (PORCENTAJE_DESCUENTO_SEGURO / 100);

   grupo_planilla.seguro = (Math.floor(grupo_planilla.seguro * 100) / 100);
   }


   
   //suamtoria de descueentos:
   grupo_planilla.total_descuentos = (
      Number(grupo_planilla.afp_ap_oblig) +
      Number(grupo_planilla.onp) +
      Number(grupo_planilla.seguro) +
      Number(grupo_planilla.quinta_categoria)
   ).toFixed(2);

   grupo_planilla.sueldo_neto = (
      Number(grupo_planilla.sueldo_bruto) -
      Number(grupo_planilla.total_descuentos)
   ).toFixed(2);

   grupo_planilla.saldo_por_pagar = (
      grupo_planilla.sueldo_neto -
      grupo_planilla.sueldo_quincenal -
      grupo_planilla.adelanto_prestamo
   ).toFixed(2);
   return grupo_planilla;
};

module.exports = unir_planillas_mensuales;
