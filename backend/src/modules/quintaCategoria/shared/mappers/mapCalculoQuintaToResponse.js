module.exports.mapCalculoQuintaToResponse = (dto) => ({
  trabajador: {
    id: dto.trabajador_id,
    contrato_id: dto.contrato_id,
    dni: dto.dni,
    anio: dto.anio,
    mes: dto.mes
  },
  entradas: {
    remuneracion_mensual: dto.remuneracion_mensual,
    ingresos_previos_acum: dto.ingresos_previos_acum,
    grati_julio_proj: dto.grati_julio_proj,
    grati_diciembre_proj: dto.grati_diciembre_proj,
    otros_ingresos_proj: dto.otros_ingresos_proj,
    extra_gravado_mes: dto.extra_gravado_mes
  },
  calculos: {
    bruto_anual_proyectado: dto.bruto_anual_proyectado,
    renta_neta_anual: dto.renta_neta_anual,
    impuesto_anual: dto.impuesto_anual,
    divisor_calculo: dto.divisor_calculo,
    tramos_usados: dto.tramos_usados
  },
  resultados: {
    retenciones_previas: dto.retenciones_previas,
    retencion_base_mes: dto.retencion_base_mes,
    retencion_adicional_mes: dto.retencion_adicional_mes
  },
  parametros: {
    uit_valor: dto.uit_valor,
    deduccion_fija_uit: dto.deduccion_fija_uit,
    deduccion_adicional_anual: dto.deduccion_adicional_anual
  },
  metadata: {
    agregado_todas_filiales: dto.agregado_todas_filiales,
    es_recalculo: dto.es_recalculo,
    fuente: dto.fuente,
    creado_por: dto.creado_por
  },
  warnings: dto.warnings
});
