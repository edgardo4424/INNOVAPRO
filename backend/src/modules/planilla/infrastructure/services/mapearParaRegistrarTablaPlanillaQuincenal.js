const moment = require("moment-timezone");

function mapearParaRegistrarTablaPlanillaQuincenal(
  registros,
  fecha_anio_mes,
  filial_id,
  usuario_cierre_id,
  cierre_planilla_quincenal_id
) {
    
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
      asignacion_familiar: r.asignacion_familiar,
      sueldo_bruto: r.sueldo_bruto,
      onp: r.onp,
      afp_oblig: r.afp,
      seguro: r.seguro,
      comision_afp: r.comision,
      quinta_categoria: r.quinta_categoria,
      total_descuentos: r.total_descuentos,
      total_pagar: r.total_a_pagar,
      locked_at: moment().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss"),
      contrato_id: r.contrato_id,
      usuario_cierre_id: usuario_cierre_id,
      filial_id: filial_id,
      cierre_planilla_quincenal_id: cierre_planilla_quincenal_id,
    };
  });
}

module.exports = { mapearParaRegistrarTablaPlanillaQuincenal };
