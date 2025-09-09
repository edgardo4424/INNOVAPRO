module.exports = async (dataBody, planillaQuincenalRepository) => {
  const { fecha_anio_mes, filial_id } = dataBody;
  const planillaQuincenalCerradas =
    await planillaQuincenalRepository.obtenerPlanillaQuincenalCerradas(
      fecha_anio_mes,
      filial_id
    ); // Llama al método del repositorio para obtener todos los gratificaciones

const planillaQuincenalCerradasTipoPlanilla = planillaQuincenalCerradas.filter((g) => g.tipo_contrato == "PLANILLA");
const planillaQuincenalCerradasTipoHonorarios = planillaQuincenalCerradas.filter((g) => g.tipo_contrato == "HONORARIOS");

  const planillaQuincenalPlanillaMapeadas = planillaQuincenalCerradasTipoPlanilla.map((g) => ({
    trabajador_id: g.trabajador.id,
    tipo_documento: g.trabajador.tipo_documento,
    numero_documento: g.trabajador.numero_documento,
    nombres: g.trabajador.nombres,
    apellidos: g.trabajador.apellidos,
    tipo_contrato: g.tipo_contrato,
    contrato_id: g.contrato_id,
    regimen: g.regimen,
    fecha_ingreso: g.fecha_ingreso,
    fecha_fin: g.fecha_fin,
    dias_laborados: g.dias_laborados,
    sueldo_base: g.sueldo_base,
    sueldo_quincenal: g.sueldo_quincenal,
    asignacion_familiar: g.asignacion_familiar,
    sueldo_bruto: g.sueldo_bruto,
    onp: g.onp,
    afp: g.afp_oblig,
    seguro: g.seguro,
    comision: g.comision_afp,
    quinta_categoria: g.quinta_categoria,
    total_descuentos: g.total_descuentos,
    total_a_pagar: g.total_pagar,

    
    banco: g.banco,
    numero_cuenta: g.numero_cuenta,
    registro_planilla_quincenal_detalle: g.registro_planilla_quincenal_detalle
  }));

  const planillaQuincenalHonorariosMapeadas = planillaQuincenalCerradasTipoHonorarios.map((g) => ({
    trabajador_id: g.trabajador.id,
    tipo_documento: g.trabajador.tipo_documento,
    numero_documento: g.trabajador.numero_documento,
    nombres: g.trabajador.nombres,
    apellidos: g.trabajador.apellidos,
    tipo_contrato: g.tipo_contrato,
    contrato_id: g.contrato_id,
    regimen: g.regimen,
    fecha_ingreso: g.fecha_ingreso,
    fecha_fin: g.fecha_fin,
    dias_laborados: g.dias_laborados,
    sueldo_base: g.sueldo_base,

    sueldo_quincenal: g.sueldo_quincenal,
    total_a_pagar: g.total_pagar,

    banco: g.banco,
    numero_cuenta: g.numero_cuenta,
    registro_planilla_quincenal_detalle: g.registro_planilla_quincenal_detalle
  }))

   const planillaQuincenalCerrada =
      await planillaQuincenalRepository.obtenerCierrePlanillaQuincenal(
        fecha_anio_mes,
        filial_id
      );

      console.log('planillaQuincenalCerrada', planillaQuincenalCerrada);

  const res = {
    planilla: {
      trabajadores: planillaQuincenalPlanillaMapeadas,
    },
    honorarios: {
        trabajadores: planillaQuincenalHonorariosMapeadas
    },
    data_mantenimiento_detalle: planillaQuincenalCerrada?.data_mantenimiento_detalle
  };
  return { codigo: 200, respuesta: res };
}; // Exporta la función para que pueda ser utilizada en otros módulos
