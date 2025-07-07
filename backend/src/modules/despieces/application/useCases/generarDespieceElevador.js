const {
  generarDespieceElevador,
} = require("../../infrastructure/services/generarDespieceElevadorService");

module.exports = async (dataParaGenerarDespiece) => {

  console.log('dataParaGenerarDespiece', dataParaGenerarDespiece);

  const dataGenerarDespieceElevador = dataParaGenerarDespiece.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    nivelUltimaLlegada: Number(atributo.nivelUltimaLlegada),
    nivelInicialLlegada: Number(atributo.nivelInicialLlegada),
    alturaPisoUno: Number(atributo.alturaPisoUno),
    alturaEntrepiso: Number(atributo.alturaEntrepiso)
  }))
  })))

  const despieceGenerado = await generarDespieceElevador(
    dataGenerarDespieceElevador
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ELEVADOR generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
