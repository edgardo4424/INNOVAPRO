const { trabajador_planilla_model } = require("./trabajador_planilla_model");

const unir_planillas_mensuales = (
   planillas_obtenidas = [],
   trabajador,
   PORCENTAJE_DESCUENTO_ONP,
   PORCENTAJE_DESCUENTO_AFP,
   PORCENTAJE_DESCUENTO_SEGURO
) => {
   const grupo_planilla = { ...trabajador_planilla_model };
   for (const p of planillas_obtenidas) {
      grupo_planilla.trabajador_id = p.trabajador_id;
      grupo_planilla.contrato_id = p.contrato_id;
      grupo_planilla.tipo_contrato = "PLANILLA ";
      grupo_planilla.periodo = "POR DEFINIR";
      grupo_planilla.tipo_documento = p.tipo_documento;
      grupo_planilla.numero_documento = p.numero_documento;
      grupo_planilla.nombres_apellidos = p.nombres_apellidos;
      grupo_planilla.area = p.area;
      grupo_planilla.afp = p.afp;
      grupo_planilla.fecha_ingreso = "";
      grupo_planilla.dias_labor += p.dias_labor;
      grupo_planilla.sueldo_basico = p.sueldo_basico;
      grupo_planilla.sueldo_del_mes += p.sueldo_del_mes;
      grupo_planilla.asig_fam = p.asig_fam;
      grupo_planilla.descanso_medico += p.descanso_medico;
      grupo_planilla.licencia_con_goce_de_haber += p.licencia_con_goce_de_haber;
      grupo_planilla.licencia_sin_goce_de_haber +=
         p.licencia_sin_goce_de_haber;
      grupo_planilla.vacaciones += p.vacaciones;
      grupo_planilla.gratificacion = p.gratificacion;
      grupo_planilla.cts = p.cts;
      grupo_planilla.h_extras_primera_quincena += p.h_extras_primera_quincena;
      grupo_planilla.h_extras_segunda_quincena += p.h_extras_segunda_quincena;
      grupo_planilla.faltas_primera_quincena += p.faltas_primera_quincena;
      grupo_planilla.faltas_segunda_quincena += p.faltas_segunda_quincena;
      grupo_planilla.tardanza_primera_quincena += p.tardanza_primera_quincena;
      grupo_planilla.tardanza_segunda_quincena += p.tardanza_segunda_quincena;
      grupo_planilla.bono_primera_quincena += p.bono_primera_quincena;
      grupo_planilla.bono_segunda_quincena += p.bono_segunda_quincena;
      grupo_planilla.sueldos_brutos_obtenidos =
         grupo_planilla.sueldos_brutos_obtenidos.push(p.sueldo_bruto);
      grupo_planilla.quinta_categoria = p.quinta_categoria;
      grupo_planilla.sueldo_quincenal = p.sueldo_quincenal;
      grupo_planilla.adelanto_prestamo += p.adelanto_prestamo;
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
         Number(grupo_planilla.gratificacion) +
         Number(grupo_planilla.cts) +
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
         (PORCENTAJE_DESCUENTO_ONP / 100 / 2)
      ).toFixed(2);
   }
   if (trabajador.sistema_pension === "AFP") {
      grupo_planilla.afp_ap_oblig = (
         grupo_planilla.sueldo_bruto *
         (PORCENTAJE_DESCUENTO_AFP / 100 / 2)
      ).toFixed(2);
   }
   grupo_planilla.seguro = (
      Number(grupo_planilla.sueldo_bruto) *
      (PORCENTAJE_DESCUENTO_SEGURO / 100 / 2)
   ).toFixed(2);

   //suamtoria de descueentos:
   grupo_planilla.total_descuentos = (
      Number(grupo_planilla.afp_ap_oblig) +
      Number(grupo_planilla.onp) +
      Number(grupo_planilla.seguro) +
      Number(grupo_planilla.quinta_categoria)
   ).toFixed(2);

   grupo_planilla.sueldo_neto = (
      Number(grupo_planilla.sueldo_bruto) - Number(grupo_planilla.total_descuentos)
   ).toFixed(2);

   grupo_planilla.saldo_por_pagar = (
      grupo_planilla.sueldo_neto -
      grupo_planilla.sueldo_quincenal -
      grupo_planilla.adelanto_prestamo
   ).toFixed(2);

   return grupo_planilla;
};

module.exports=unir_planillas_mensuales;