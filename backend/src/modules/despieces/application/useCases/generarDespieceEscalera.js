const {
  generarDespieceEscalera,
} = require("../../infrastructure/services/generarDespieceEscaleraService");

module.exports = async (dataParaGenerarDespiece) => {

  const zonas = dataParaGenerarDespiece.zonas;
  const precio_tramo = dataParaGenerarDespiece.precio_tramo

  const dataGenerarDespieceEscaleraAcceso = zonas.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    alturaTotal: Number(atributo.alturaTotal),
    alturaEscaleraObra: Number(atributo.alturaEscaleraObra),
  }))
  })))

  const despieceGenerado = await generarDespieceEscalera(
    dataGenerarDespieceEscaleraAcceso,
    precio_tramo
  );


  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCALERA DE ACCESO generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado */
}; // Exporta la función para que pueda ser utilizada en otros módulos
