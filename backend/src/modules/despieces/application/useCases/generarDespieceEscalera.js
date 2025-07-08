const {
  generarDespieceEscalera,
} = require("../../infrastructure/services/Escalera/generarDespieceEscaleraService");

module.exports = async (dataParaGenerarDespiece) => {

  const dataGenerarDespieceEscaleraAcceso = dataParaGenerarDespiece.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    alturaTotal: Number(atributo.alturaTotal),
    alturaEscaleraObra: Number(atributo.alturaEscaleraObra),
  }))
  })))

  const despieceGenerado = await generarDespieceEscalera(
    dataGenerarDespieceEscaleraAcceso
  );


  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCALERA DE ACCESO generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado */
}; // Exporta la función para que pueda ser utilizada en otros módulos
