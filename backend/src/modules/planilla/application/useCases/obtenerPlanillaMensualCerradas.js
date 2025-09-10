module.exports = async (dataBody, planillaQuincenalRepository) => {
  const { fecha_anio_mes, filial_id } = dataBody;
  const planillaQuincenalCerradas =
    await planillaQuincenalRepository.obtenerPlanillaMensualCerradas(
      fecha_anio_mes,
      filial_id
    ); // Llama al método del repositorio para obtener todos los gratificaciones

  return { codigo: 200, respuesta: planillaQuincenalCerradas };
}; // Exporta la función para que pueda ser utilizada en otros módulos
