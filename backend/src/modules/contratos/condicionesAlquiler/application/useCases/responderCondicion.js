module.exports = async (contratoId, condiciones, actualizado_por, condicionRepository, contratoRepository) => {
  const condicion = await condicionRepository.obtenerPorContratoId(contratoId);
  if (!condicion) return { codigo: 404, respuesta: { mensaje: "No se encontró la condición para el contrato asociado" } };

  const condicionesFormateadas = {
    condiciones,
    estado: "DEFINIDAS",
    actualizado_por
  };

  const actualizada = await condicionRepository.actualizarCondicion(condicion.id, condicionesFormateadas);
  
  // Actualizar el estado del contrato a "Validando Condiciones"
  await contratoRepository.actualizarEstadoCondiciones(contratoId, "Validando Condiciones");
  
  return { codigo: 200, respuesta: actualizada };
}