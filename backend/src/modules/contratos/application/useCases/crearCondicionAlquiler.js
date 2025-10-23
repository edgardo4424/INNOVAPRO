module.exports = async (data, condicionRepository, transaction = null) => {
  const { contrato_id, comentario_solicitud, creado_por } = data;

  if (!contrato_id) {
    return { codigo: 400, respuesta: { mensaje: "El contrato es obligatorio" } };
  }

  const yaExiste = await condicionRepository.obtenerPorContratoId(contrato_id, transaction);
  if (yaExiste) {
    return { codigo: 409, respuesta: { mensaje: "Ya existe una solicitud de condiciones para este contrato" } };
  }

  const nuevaCondicion = await condicionRepository.crearCondicion({
    contrato_id,
    comentario_solicitud,
    creado_por,
    estado: "PENDIENTE"
  }, transaction);

  console.log("Nueva condición de alquiler creada:", nuevaCondicion);
  return {
    codigo: 201,
    respuesta: { mensaje: "Condiciones de alquiler registradas", condicion: nuevaCondicion }
  };
};