module.exports = async (data, condicionRepository) => {
  const { cotizacion_id, comentario_solicitud, creado_por } = data;

  if (!cotizacion_id) {
    return { codigo: 400, respuesta: { mensaje: "cotizacion_id es obligatorio" } };
  }

  const yaExiste = await condicionRepository.obtenerPorCotizacionId(cotizacion_id);
  if (yaExiste) {
    return { codigo: 409, respuesta: { mensaje: "Ya existe una solicitud de condiciones para esta cotización" } };
  }

  const nuevaCondicion = await condicionRepository.crearCondicion({
    cotizacion_id,
    comentario_solicitud,
    creado_por,
    estado: "PENDIENTE"
  });

  return {
    codigo: 201,
    respuesta: { mensaje: "Condiciones de alquiler registradas", condicion: nuevaCondicion }
  };
};