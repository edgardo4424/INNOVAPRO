module.exports = async (trabajadorRepository) => {
  const areas = await trabajadorRepository.obtenerAreas();
  return {
    codigo: 201,
    respuesta: {
      mensaje: "Petición exitosa",
      areas: areas,
    },
  };
};
