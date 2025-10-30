module.exports = async (contratoId, condicionesCumplidas, condicionRepository , contratoRepository,pasePedidoRepository) => {
  console.log("ENTRO A MARCAR CONDICIONES CUMPLIDAS");
  const condicion = await condicionRepository.obtenerPorContratoId(contratoId);
  if (!condicion) {
    return { codigo: 404, respuesta: { mensaje: "No se encontró la condición para el contrato asociado" } };
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
  await condicionRepository.actualizarCondicionesCumplidas(contratoId, condicionesCumplidas, todasCumplidas);

  // Si están todas cumplidas, también actualizamos el estado del contrato
  if (todasCumplidas) {
    await contratoRepository.actualizarEstadoCondiciones(contratoId, "Condiciones Cumplidas");
  }

  // Actualizar el estado del pase de pedido
  await pasePedidoRepository.actualizarPasePedidoAutomatico(contratoId);
  
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