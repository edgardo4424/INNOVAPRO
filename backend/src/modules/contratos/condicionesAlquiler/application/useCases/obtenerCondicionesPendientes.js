module.exports = async (condicionRepository) => {
  const condiciones = await condicionRepository.listarPendientesConContrato();
  return condiciones;
};