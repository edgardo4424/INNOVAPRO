function calcularResumenGratificaciones(listaTrabajadores) {
  const sumar = (campo) =>
    listaTrabajadores.reduce((acc, t) => acc + parseFloat(t[campo] || 0), 0);

  return {
    total_sueldo: sumar("sueldo_base").toFixed(2),
    total_asig_familiar: sumar("asig_familiar").toFixed(2),
    total_horas_extras: sumar("prom_horas_extras").toFixed(2),
    total_bono_obra: sumar("prom_bono_obra").toFixed(2),
    total_sueldo_bruto: (
      sumar("sueldo_base") +
      sumar("asig_familiar") +
      sumar("prom_horas_extras") +
      sumar("prom_bono_obra")
    ).toFixed(2),
    total_gratificacion_semestral: sumar("gratificacion_semestral").toFixed(2),
    total_faltas: sumar("falta_dias").toFixed(2),
    total_importe_falta: (-sumar("falta_importe")).toFixed(2),
    total_no_computable: (-sumar("no_computable")).toFixed(2),
    total_gratificacion_despues_descuento: sumar("grat_despues_descuento").toFixed(2),
    total_bonificacion_essalud: sumar("bonificac_essalud").toFixed(2),
    total_rent_quint_cat: sumar("rent_quint_cat").toFixed(2),
    total_mont_adelanto: sumar("mont_adelanto").toFixed(2),
    total_total_a_pagar: sumar("total_a_pagar").toFixed(2),
  };
}

module.exports = { calcularResumenGratificaciones}