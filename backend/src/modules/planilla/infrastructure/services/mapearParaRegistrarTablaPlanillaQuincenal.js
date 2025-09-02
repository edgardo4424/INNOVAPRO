const moment = require("moment-timezone");

function mapearParaRegistrarTablaPlanillaQuincenal(
  registros,
  fecha_anio_mes,
  filial_id,
  usuario_cierre_id,
  cierre_planilla_quincenal_id
) {
  console.log("registros", registros);
  return registros.map((r) => {
    console.log('r', r);
    return {
      trabajador_id: r.trabajador_id,
      tipo_contrato: r.tipo_contrato,
      periodo: fecha_anio_mes,
      fecha_calculo: moment().tz("America/Lima").format("YYYY-MM-DD"),
      regimen: r.regimen,
      fecha_ingreso: r.fecha_ingreso,
      fecha_fin: r.fecha_fin,
      dias_laborados: r.dias_laborados,
      sueldo_base: r.sueldo_base,
      sueldo_quincenal: r.sueldo_quincenal,
      asignacion_familiar: r.asignacion_familiar || 0,
      sueldo_bruto: r.sueldo_bruto || 0,
      onp: r.onp || 0,
      afp_oblig: r.afp || 0,
      seguro: r.seguro || 0,
      comision_afp: r.comision || 0,
      quinta_categoria: r.quinta_categoria || 0,
      total_descuentos: r.total_descuentos || 0,
      total_pagar: r.total_a_pagar,
      locked_at: moment().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss"),
      banco: r.banco,
      numero_cuenta: r.numero_cuenta,
      contrato_id: r.contrato_id,
      usuario_cierre_id: usuario_cierre_id,
      filial_id: filial_id,
      cierre_planilla_quincenal_id: cierre_planilla_quincenal_id,
    };
  });
}

module.exports = { mapearParaRegistrarTablaPlanillaQuincenal };
