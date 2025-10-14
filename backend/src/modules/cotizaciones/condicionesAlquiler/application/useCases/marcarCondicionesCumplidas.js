module.exports = async (cotizacionId, condicionesCumplidas, condicionRepository, cotizacionRepository) => {
  const condicion = await condicionRepository.obtenerPorCotizacionId(cotizacionId);
  if (!condicion) {
    return { codigo: 404, respuesta: { mensaje: "No se encontró la condición" } };
  }

  const condicionesRawCompleto = condicion.condiciones.split("CONDICIONES AUTORIZADAS:")[1] || "";

  // Eliminamos todo lo que venga después de OBSERVACIÓN:
  const condicionesLimpias = condicionesRawCompleto.split("OBSERVACIÓN:")[0] || "";

  const definidas = condicionesLimpias
    .split("•")
    .map((c) => c.trim())
    .filter(Boolean);


  const faltantes = definidas.filter(c => !condicionesCumplidas.includes(c));
  const todasCumplidas = faltantes.length === 0;

  // Actualizamos las condiciones 
  await condicionRepository.actualizarCondicionesCumplidas(cotizacionId, condicionesCumplidas, todasCumplidas);

  // Si están todas cumplidas, también actualizamos el estado de la cotización
  if (todasCumplidas) {
    await cotizacionRepository.actualizarEstado(cotizacionId, 9); // 9 significa "Condiciones Cumplidas"
  }
  
  return {
    codigo: 200,
    respuesta: {
        mensaje: todasCumplidas
          ? "Todas las condiciones fueron cumplidas. Estado actualizado correctamente."
          : "Condiciones actualizadas correctamente, pero aún faltan algunas por cumplir.",
          todasCumplidas,
    }
  }
};