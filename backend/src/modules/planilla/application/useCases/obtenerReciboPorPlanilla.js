module.exports = async (payload, planillaRepository) => {
  const { fecha_anio_mes, filial_id } = payload;
  const planillasxrecibos = await planillaRepository.obtenerReciboPorPlanilla(
    fecha_anio_mes,
    filial_id
  );

  return { codigo: 200, respuesta: planillasxrecibos };
};