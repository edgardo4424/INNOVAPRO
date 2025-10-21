module.exports = async (payload, planillaRepository) => {
  const { fecha_anio_mes, filial_id } = payload;

  const cierre = await planillaRepository.obtenerCierrePlanillaMensual(
    fecha_anio_mes,
    filial_id
  );
  if (!cierre || !cierre.locked_at) {
    return {
      codigo: 403,
      respuesta: {
        mensaje: "La planilla mensual de esta filial aún no ha sido cerrada.",
      },
    };
  }
  const planillasxrecibos = await planillaRepository.obtenerReciboPorPlanilla(
    fecha_anio_mes,
    filial_id
  );

  return { codigo: 200, respuesta: planillasxrecibos };
};
