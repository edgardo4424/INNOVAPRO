module.exports = class RecalcularQuinta {
  constructor(repo) {
    this.repo = repo;
  }
  async execute({ id, overrideInput = {}, creadoPor, transaction }) {
    const prev = await this.repo.findById(id);
    if (!prev) {
      const err = new Error("Cálculo no encontrado");
      err.status = 404;
      throw err;
    }

    const dto = {
      // Identificación
      trabajador_id: overrideInput.trabajador_id ?? overrideInput.trabajadorId ?? prev.trabajador_id ?? null,
      contrato_id:  overrideInput.contrato_id  ?? overrideInput.contratoId  ?? prev.contrato_id  ?? null,
      filial_id:    overrideInput.filial_id    ?? prev.filial_id ?? null,
      dni:          overrideInput.dni          ?? prev.dni,
      anio: Number(overrideInput.anio ?? prev.anio),
      mes:  Number(overrideInput.mes  ?? prev.mes),

      // Entradas visibles
      remuneracion_mensual: Number(
        overrideInput.remuneracion_mensual ??
        overrideInput.remuneracionMensualActual ??
        prev.remuneracion_mensual ?? 0
      ),
      ingresos_previos_acum: Number(
        overrideInput.ingresos_previos_acum ??
        overrideInput.ingresosPrevios?.total_ingresos ??
        prev.ingresos_previos_acum ?? 0
      ),
      grati_julio_proj:      Number(overrideInput.grati_julio_proj      ?? prev.grati_julio_proj      ?? 0),
      grati_diciembre_proj:  Number(overrideInput.grati_diciembre_proj  ?? prev.grati_diciembre_proj  ?? 0),
      otros_ingresos_proj:   Number(overrideInput.otros_ingresos_proj   ?? overrideInput.otrosIngresosProyectados ?? prev.otros_ingresos_proj ?? 0),
      extra_gravado_mes:     Number(overrideInput.extra_gravado_mes     ?? overrideInput.extraGravadoMes ?? prev.extra_gravado_mes ?? 0),

      // Cálculos
      bruto_anual_proyectado: Number(overrideInput.bruto_anual_proyectado ?? prev.bruto_anual_proyectado ?? 0),
      renta_neta_anual:       Number(overrideInput.renta_neta_anual       ?? prev.renta_neta_anual       ?? 0),
      impuesto_anual:         Number(overrideInput.impuesto_anual         ?? prev.impuesto_anual         ?? 0),
      divisor_calculo:        Number(overrideInput.divisor_calculo        ?? prev.divisor_calculo        ?? 0),
      tramos_usados:                overrideInput.tramos_usados           ?? prev.tramos_usados          ?? [],

      // Resultados del mes
      retenciones_previas:    Number(overrideInput.retenciones_previas    ?? overrideInput.retencionesPrevias ?? prev.retenciones_previas ?? 0),
      retencion_base_mes:     Number(overrideInput.retencion_base_mes     ?? prev.retencion_base_mes     ?? 0),
      retencion_adicional_mes:Number(overrideInput.retencion_adicional_mes?? prev.retencion_adicional_mes?? 0),

      // Parámetros
      uit_valor:              Number(overrideInput.uit_valor              ?? prev.uit_valor              ?? 0),
      deduccion_fija_uit:     Number(overrideInput.deduccion_fija_uit     ?? prev.deduccion_fija_uit     ?? 0),
      deduccion_adicional_anual: Number(overrideInput.deduccion_adicional_anual ?? prev.deduccion_adicional_anual ?? 0),

      // Meta/soportes
      origen_retencion:             overrideInput.origen_retencion             ?? prev.origen_retencion ?? 'NINGUNO',
      es_secundaria:          Number(overrideInput.es_secundaria               ?? prev.es_secundaria    ?? 0),
      filial_retiene_id:      Number(overrideInput.filial_retiene_id           ?? prev.filial_retiene_id ?? null),
      ingresos_previos_internos: Number(overrideInput.ingresos_previos_internos ?? prev.ingresos_previos_internos ?? 0),
      ingresos_previos_externos: Number(overrideInput.ingresos_previos_externos ?? prev.ingresos_previos_externos ?? 0),
      retenciones_previas_externas: Number(overrideInput.retenciones_previas_externas ?? prev.retenciones_previas_externas ?? 0),
      soporte_multiempleo_id: overrideInput.soporte_multiempleo_id ?? prev.soporte_multiempleo_id ?? null,
      soporte_certificado_id: overrideInput.soporte_certificado_id ?? prev.soporte_certificado_id ?? null,
      soporte_sin_previos_id: overrideInput.soporte_sin_previos_id ?? prev.soporte_sin_previos_id ?? null,
      soportes_json:          overrideInput.soportes_json ?? prev.soportes_json ?? null,

      // Flags
      agregado_todas_filiales: !!(overrideInput.agregado_todas_filiales ?? overrideInput.agregadoTodasFiliales ?? prev.agregado_todas_filiales),
      es_recalculo: true,
      fuente: 'oficial',
      creado_por: creadoPor ?? prev.creado_por ?? null,
    };

    // Snapshot de tramos para auditoría (igual que GuardarCalculoQuinta)
    dto.tramos_usados_json = overrideInput.tramos_usados_json ?? {
      impuestoTotal: dto.impuesto_anual,
      tramos_usados: dto.tramos_usados
    };

    return await this.repo.updateById(id, dto, { transaction });
  }
};