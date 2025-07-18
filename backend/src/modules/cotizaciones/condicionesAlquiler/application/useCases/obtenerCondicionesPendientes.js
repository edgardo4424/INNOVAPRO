module.exports = async (condicionRepository) => {
  const condiciones = await condicionRepository.listarPendientesConCotizacion();
  return condiciones;
};