//ARMAR LOS DATOS PARA LA ESTRUCTURA 18:  Trabajador - Detalle de ingresos, tributos y descuentos.
const generarRem=(t,tipo_documento)=> {
  let lineas = [];
    
  // 🟢 INGRESOS -------------------

  if (t.sueldo_basico) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|1001|${t.sueldo_basico.toFixed(2)}|${t.sueldo_basico.toFixed(2)}`);
  }

  if (t.asig_fam) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|1002|${t.asig_fam.toFixed(2)}|${t.asig_fam.toFixed(2)}`);
  }

  const horasExtras = (t.h_extras_primera_quincena || 0) + (t.h_extras_segunda_quincena || 0);
  if (horasExtras > 0) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|2001|${horasExtras.toFixed(2)}|${horasExtras.toFixed(2)}`);
  }

  if (t.vacaciones) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|2005|${t.vacaciones.toFixed(2)}|${t.vacaciones.toFixed(2)}`);
  }

  if (t.vacaciones_vendidas) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|2006|${t.vacaciones_vendidas.toFixed(2)}|${t.vacaciones_vendidas.toFixed(2)}`);
  }

  if (t.gratificacion) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|3001|${t.gratificacion.toFixed(2)}|${t.gratificacion.toFixed(2)}`);
  }

  if (t.cts) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|3002|${t.cts.toFixed(2)}|${t.cts.toFixed(2)}`);
  }

  const bonos = (t.bono_primera_quincena || 0) + (t.bono_segunda_quincena || 0);
  if (bonos > 0) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|1003|${bonos.toFixed(2)}|${bonos.toFixed(2)}`);
  }

  // 🔴 DESCUENTOS -------------------

  if (t.onp) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0600|0.00|${t.onp.toFixed(2)}`);
  }

  if (t.afp_ap_oblig) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0606|0.00|${t.afp_ap_oblig.toFixed(2)}`);
  }

  if (t.comision) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0608|0.00|${t.comision.toFixed(2)}`);
  }

  if (t.seguro) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0609|0.00|${t.seguro.toFixed(2)}`);
  }

  if (t.quinta_categoria) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0701|0.00|${t.quinta_categoria.toFixed(2)}`);
  }

  if (t.adelanto_prestamo) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0801|0.00|${t.adelanto_prestamo.toFixed(2)}`);
  }

  // 🟠 TRIBUTOS EMPLEADOR -------------------

  if (t.essalud) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0900|${t.essalud.toFixed(2)}|${t.essalud.toFixed(2)}`);
  }

  if (t.seguro_vida_ley) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0910|${t.seguro_vida_ley.toFixed(2)}|${t.seguro_vida_ley.toFixed(2)}`);
  }

  if (t.sctr_salud) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0911|${t.sctr_salud.toFixed(2)}|${t.sctr_salud.toFixed(2)}`);
  }

  if (t.sctr_pension) {
    lineas.push(`${tipo_documento}|${t.numero_documento}|0912|${t.sctr_pension.toFixed(2)}|${t.sctr_pension.toFixed(2)}`);
  }

  
  return lineas;
}


module.exports=generarRem