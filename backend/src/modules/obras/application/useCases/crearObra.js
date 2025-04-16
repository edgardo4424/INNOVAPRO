module.exports = async (obraData, obraRepository, entidadService) => {
  const errorCampos = entidadService.validarCamposObligatorios(obraData);

  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; // Validamos campos obligatorios

  const nuevoObraData = {
    nombre: obraData.nombre,
    direccion: obraData.direccion,
    ubicacion: obraData.ubicacion,
    estado: obraData.estado,
    creado_por: obraData.creado_por,
  };

  const nuevoObra = await obraRepository.crear(nuevoObraData); // Creamos el nuevo obra con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Obra creado exitosamente", obra: nuevoObra },
  }; // Retornamos el obra creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
