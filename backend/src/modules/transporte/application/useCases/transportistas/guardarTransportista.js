module.exports = async (transporte, transporteRepository) => {
  let result;

  // ? Si viene transportista con ID -> actualizar, si no -> crear
  if (
    transporte.transportista &&
    transporte.transportista.id != null &&
    transporte.transportista.id != undefined
  ) {
    result = await transporteRepository.actualizar(transporte);
  } else {
    result = await transporteRepository.crear(transporte);
  }

  const { success, message, data } = result;

  if (!success) {
    return {
      codigo: 400,
      respuesta: {
        success,
        message,
        data: null,
      },
    };
  }

  return {
    codigo: 200,
    respuesta: {
      success,
      message,
      data,
    },
  };
};
