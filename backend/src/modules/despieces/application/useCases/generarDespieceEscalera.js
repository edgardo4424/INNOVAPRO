const {
  generarDespieceEscalera,
} = require("../../infrastructure/services/generarDespieceEscaleraService");

module.exports = async (dataParaGenerarDespiece) => {

  const atributos = dataParaGenerarDespiece.atributos_formulario;
  const precio_tramo = dataParaGenerarDespiece.precio_tramo

  const atributosFormularioFormateado = atributos.map((atributo) => ({
    ...atributo,
    alturaTotal: Number(atributo.alturaTotal),
    alturaEscaleraObra: Number(atributo.alturaEscaleraObra),
  }));

  const despieceGenerado = await generarDespieceEscalera(
    atributosFormularioFormateado,
    precio_tramo
  );

  console.log('despieceGenerado', despieceGenerado);

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCALERAS generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
