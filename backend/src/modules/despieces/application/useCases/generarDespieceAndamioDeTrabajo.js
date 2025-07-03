const {
  generarDespieceAndamioTrabajo,
} = require("../../infrastructure/services/generarDespieceAndamioTrabajoService");

module.exports = async (dataParaGenerarDespiece) => {
 
  const dataGenerarDespieceAndamioTrabajo = dataParaGenerarDespiece.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    longitud: Number(atributo.longitud),
    ancho: Number(atributo.ancho),
    altura: Number(atributo.altura),
    diagonalAncho: Number(atributo.diagonalAncho),
    tuboAmarre: Number(atributo.tuboAmarre)
  }))
  })))

  console.log('dataGenerarDespieceAndamioTrabajo', dataGenerarDespieceAndamioTrabajo);

  const despieceGenerado = await generarDespieceAndamioTrabajo(
    dataGenerarDespieceAndamioTrabajo
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ANDAMIO DE TRABAJO generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
