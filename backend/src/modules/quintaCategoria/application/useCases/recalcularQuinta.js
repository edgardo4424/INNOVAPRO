// INNOVA PRO+ v1.3.0 - RecalcularQuinta alineado a nueva quinta_calculos
module.exports = class RecalcularQuinta {
  constructor(repo) { this.repo = repo; }

  async execute({ id, overrideInput = {}, creadoPor, transaction }) {
    const prev = await this.repo.findById(id);
    if (!prev) { const err = new Error("Cálculo no encontrado"); err.status = 404; throw err; }

    const N = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;

    const dto = {
      // Identificación
      trabajador_id: overrideInput.trabajador_id ?? prev.trabajador_id ?? null,
      contrato_id:   overrideInput.contrato_id   ?? prev.contrato_id   ?? null,
      filial_actual_id: overrideInput.filial_actual_id ?? prev.filial_actual_id ?? null,
      es_secundaria: N(overrideInput.es_secundaria ?? prev.es_secundaria, 0),
      filial_retenedora_id: overrideInput.filial_retenedora_id ?? prev.filial_retenedora_id ?? null,

      dni: overrideInput.dni ?? prev.dni,
      anio: N(overrideInput.anio ?? prev.anio),
      mes:  N(overrideInput.mes  ?? prev.mes),

      // Parámetros
      uit_valor:          N(overrideInput.uit_valor          ?? prev.uit_valor),
      deduccion_fija_uit: N(overrideInput.deduccion_fija_uit ?? prev.deduccion_fija_uit),
      divisor_calculo: N(overrideInput.divisor_calculo ?? prev.divisor_calculo),

      // Soportes
      soporte_multi_interno_id: overrideInput.soporte_multi_interno_id ?? prev.soporte_multi_interno_id ?? null,
      soporte_multiempleo_id:   overrideInput.soporte_multiempleo_id   ?? prev.soporte_multiempleo_id   ?? null,
      soporte_certificado_id:   overrideInput.soporte_certificado_id   ?? prev.soporte_certificado_id   ?? null,
      soporte_sin_previos_id:   overrideInput.soporte_sin_previos_id   ?? prev.soporte_sin_previos_id   ?? null,

      // Fuente/previos
      fuente_previos: overrideInput.fuente_previos ?? prev.fuente_previos ?? 'AUTO',
      ingresos_previos_internos:          N(overrideInput.ingresos_previos_internos          ?? prev.ingresos_previos_internos),
      ingresos_previos_externos:          N(overrideInput.ingresos_previos_externos          ?? prev.ingresos_previos_externos),
      ingresos_previos_acum_filial_actual:N(overrideInput.ingresos_previos_acum_filial_actual?? prev.ingresos_previos_acum_filial_actual),

      // Entradas actuales
      remuneracion_mensual_filial_actual: N(overrideInput.remuneracion_mensual_filial_actual ?? prev.remuneracion_mensual_filial_actual),
      bonos:                               N(overrideInput.bonos                               ?? prev.bonos),
      asignacion_familiar:                 N(overrideInput.asignacion_familiar                 ?? prev.asignacion_familiar),

      // Pagos reales
      grati_julio_pagada:             N(overrideInput.grati_julio_pagada             ?? prev.grati_julio_pagada),
      grati_diciembre_pagada:         N(overrideInput.grati_diciembre_pagada         ?? prev.grati_diciembre_pagada),
      grati_pagadas_otras:            N(overrideInput.grati_pagadas_otras            ?? prev.grati_pagadas_otras),
      asignacion_familiar_total_otras:N(overrideInput.asignacion_familiar_total_otras?? prev.asignacion_familiar_total_otras),

      // Proyecciones
      grati_julio_proj:         N(overrideInput.grati_julio_proj         ?? prev.grati_julio_proj),
      grati_diciembre_proj:     N(overrideInput.grati_diciembre_proj     ?? prev.grati_diciembre_proj),
      otros_ingresos_proj:      N(overrideInput.otros_ingresos_proj      ?? prev.otros_ingresos_proj),
      asignacion_familiar_proj: N(overrideInput.asignacion_familiar_proj ?? prev.asignacion_familiar_proj),

      // Multi interno (otras filiales)
      remu_proj_total_otras:          N(overrideInput.remu_proj_total_otras          ?? prev.remu_proj_total_otras),
      grati_proj_total_otras:         N(overrideInput.grati_proj_total_otras         ?? prev.grati_proj_total_otras),
      asignacion_familiar_proj_otras: N(overrideInput.asignacion_familiar_proj_otras ?? prev.asignacion_familiar_proj_otras),

      // Retenciones
      origen_retencion: overrideInput.origen_retencion ?? prev.origen_retencion,
      retenciones_previas_internas:      N(overrideInput.retenciones_previas_internas      ?? prev.retenciones_previas_internas),
      retenciones_previas_externas:      N(overrideInput.retenciones_previas_externas      ?? prev.retenciones_previas_externas),
      retenciones_previas_filial_actual: N(overrideInput.retenciones_previas_filial_actual ?? prev.retenciones_previas_filial_actual),

      // Mes en curso
      extra_gravado_mes:       N(overrideInput.extra_gravado_mes       ?? prev.extra_gravado_mes),
      retencion_adicional_mes: N(overrideInput.retencion_adicional_mes ?? prev.retencion_adicional_mes),

      // Resultados
      bruto_anual_proyectado: N(overrideInput.bruto_anual_proyectado ?? prev.bruto_anual_proyectado),
      renta_neta_anual:       N(overrideInput.renta_neta_anual       ?? prev.renta_neta_anual),
      impuesto_anual:         N(overrideInput.impuesto_anual         ?? prev.impuesto_anual),
      retencion_base_mes:     N(overrideInput.retencion_base_mes     ?? prev.retencion_base_mes),

      es_recalculo: true,
      creado_por: creadoPor ?? prev.creado_por ?? null,
    };

    // Snapshot de tramos
    dto.tramos_usados_json = overrideInput.tramos_usados_json ?? {
      impuestoTotal: dto.impuesto_anual,
      tramos_usados: overrideInput.tramos_usados ?? prev.tramos_usados ?? []
    };

    return await this.repo.updateById(id, dto, { transaction });
  }
};