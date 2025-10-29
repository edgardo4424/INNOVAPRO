module.exports = async (
  trabajador_id,
  trabajadorRepository,
  transaction = null
) => {
  if (!trabajador_id) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Los datos enviados en la petición son incorrectos",
      },
    };
  }
  await trabajadorRepository.eliminarTrabajadorPorId(
    trabajador_id,
    transaction
  );
  return {
    codigo: 200,
    respuesta: {
      mensaje: "El trabajador fue eliminado correctamente",
    },
  };
};
