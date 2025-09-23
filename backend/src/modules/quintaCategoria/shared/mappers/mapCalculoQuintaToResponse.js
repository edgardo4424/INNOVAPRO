module.exports.mapCalculoQuintaToResponse = (dto) => ({
  trabajador: {
    id: dto.trabajador_id,
    contrato_id: dto.contrato_id,
    dni: dto.dni,
    anio: dto.anio,
    mes: dto.mes,
    filial_id: dto.filial_id ?? null,
  },
  entradas: {
    remuneracion_mensual: dto.remuneracion_mensual,
    ingresos_previos_acum: dto.ingresos_previos_acum,
    grati_julio_proj: dto.grati_julio_proj ?? 0,
    grati_diciembre_proj: dto.grati_diciembre_proj ?? 0,
    otros_ingresos_proj: dto.otros_ingresos_proj ?? 0,
    extra_gravado_mes: dto.extra_gravado_mes ?? 0
  },
  calculos: {
    bruto_anual_proyectado: dto.bruto_anual_proyectado,
    renta_neta_anual: dto.renta_neta_anual,
    impuesto_anual: dto.impuesto_anual,
    divisor_calculo: dto.divisor_calculo,
    tramos_usados: dto.tramos_usados
  },
  resultados: {
    retenciones_previas: dto.retenciones_previas ?? 0,
    retencion_base_mes: dto.retencion_base_mes ?? 0,
    retencion_adicional_mes: dto.retencion_adicional_mes ?? 0
  },
  parametros: {
    uit_valor: dto.uit_valor,
    deduccion_fija_uit: dto.deduccion_fija_uit,
  },
  metadata: {
    es_recalculo: dto.es_recalculo,
    fuente: dto.fuente,
    creado_por: dto.creado_por
  },
  warnings: dto.warnings
});
