module.exports = async (cotizacionId, condiciones, actualizado_por, condicionRepository, cotizacionRepository) => {
  const condicion = await condicionRepository.obtenerPorCotizacionId(cotizacionId);
  if (!condicion) return { codigo: 404, respuesta: { mensaje: "No se encontró la condición" } };

  const condicionesFormateadas = {
    condiciones,
    estado: "DEFINIDAS",
    actualizado_por
  };

  const actualizada = await condicionRepository.actualizarCondicion(condicion.id, condicionesFormateadas);
  
  // Actualizar el estado de la cotización a "Validar Condiciones"
  // El 8 significa Validar Condiciones
  await cotizacionRepository.actualizarEstado(cotizacionId, 8);
  
  return { codigo: 200, respuesta: actualizada };
}