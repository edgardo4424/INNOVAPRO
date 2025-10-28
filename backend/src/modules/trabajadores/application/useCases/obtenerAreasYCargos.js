module.exports = async (trabajadorRepository) => {
  const areasYCargos = await trabajadorRepository.obtenerAreasYCargos();
  return {
    codigo: 200,
    respuesta: {
      mensaje: "Petición exitosa",
      data: areasYCargos,
    },
  };
};
