const {
  generarDespieceAndamioTrabajo,
} = require("../../infrastructure/services/generarDespieceAndamioTrabajoService");

module.exports = async (dataParaGenerarDespiece) => {
  const atributos = dataParaGenerarDespiece.atributos_formulario;

  console.log('atributos', atributos);

  const atributosFormularioFormateado = atributos.map((atributo) => ({
    ...atributo,
    longitud: Number(atributo.longitud),
    ancho: Number(atributo.ancho),
    altura: Number(atributo.altura),
    diagonalAncho: Number(atributo.diagonalAncho),
    tuboAmarre: Number(atributo.tuboAmarre)
  }));

  console.log(atributosFormularioFormateado);

  const despieceGenerado = await generarDespieceAndamioTrabajo(
    atributosFormularioFormateado
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ANDAMIO DE TRABAJO generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
