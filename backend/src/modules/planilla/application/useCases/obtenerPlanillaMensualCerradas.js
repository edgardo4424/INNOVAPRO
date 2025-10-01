//Se corrigio los nombre de las constantes y paramentro, no coincidia con el caso de uso
module.exports = async (dataBody, planillaRepository) => {
  const { fecha_anio_mes, filial_id } = dataBody;
  const planillaMensualCerradas =
    await planillaRepository.obtenerPlanillaMensualCerradas(
      fecha_anio_mes,
      filial_id
    ); // Llama al método del repositorio para obtener todos los gratificaciones

  return { codigo: 200, respuesta: planillaMensualCerradas };
}; // Exporta la función para que pueda ser utilizada en otros módulos
