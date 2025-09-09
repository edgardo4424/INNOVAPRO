module.exports = async (dataBody, gratificacionRepository) => {
  const { periodo, anio, filial_id } = dataBody;
  const gratificacionesCerradas =
    await gratificacionRepository.obtenerGratificacionesCerradas(
      periodo,
      anio,
      filial_id
    ); // Llama al método del repositorio para obtener todos los gratificaciones

  const gratificacionesMapeadas = gratificacionesCerradas.map((g) => ({
    trabajador_id: g.trabajador.id,
    tipo_documento: g.trabajador.tipo_documento,
    numero_documento: g.trabajador.numero_documento,
    nombres: g.trabajador.nombres,
    apellidos: g.trabajador.apellidos,
    tipo_contrato: g.tipo_contrato,
    regimen: g.regimen,
    fecha_ingreso: g.fecha_ingreso,
    fecha_fin: g.fecha_fin,
    tiempo_laborado: `${g.meses_computables.toString().padStart(2, '0')} MESES`,
    sueldo_base: g.sueldo_base,
    asig_familiar: g.asignacion_familiar,
    prom_horas_extras: g.promedio_horas_extras,
    prom_bono_obra: g.promedio_bono_obra,
    sueldo_bruto: g.remuneracion_computable,
    gratificacion_semestral: g.remuneracion_computable,
    falta_dias: g.faltas_dias,
    falta_importe: g.faltas_monto,
    no_computable: g.no_computable,
    grat_despues_descuento: g.gratificacion_neta,
    bonificac_essalud: g.bonificacion_extraordinaria,
    rent_quint_cat_no_domiciliado: g.renta_5ta,
    mont_adelanto: g.adelantos,
    total_a_pagar: g.total_pagar,
    banco: g.banco,
    numero_cuenta: g.numero_cuenta,
    contratos: g.contratos,
    data_mantenimiento_detalle: g.data_mantenimiento_detalle,
    info_detalle: g.info_detalle,
  }));

    const gratificacionCerrada =
      await gratificacionRepository.obtenerCierreGratificacion(
        periodo,
        anio,
        filial_id
      );

  const res = {
    planilla: {
      trabajadores: gratificacionesMapeadas,
    },
    data_mantenimiento_detalle: gratificacionCerrada ? gratificacionCerrada.data_mantenimiento_detalle : null
  };
  return { codigo: 200, respuesta: res };
}; // Exporta la función para que pueda ser utilizada en otros módulos
