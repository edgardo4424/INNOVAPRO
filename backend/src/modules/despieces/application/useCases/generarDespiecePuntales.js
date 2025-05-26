const {
  generarDespiecePuntales,
} = require("../../infrastructure/services/generarDespiecePuntalesService");

module.exports = async (dataParaGenerarDespiece) => {

  const atributos = dataParaGenerarDespiece.atributos_formulario;

  const atributosFormularioFormateado = atributos.map((atributo) => ({
    ...atributo,
    cantidad: Number(atributo.cantidad),
  }));

  const despieceGenerado = await generarDespiecePuntales(
    atributosFormularioFormateado
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso PUNTALES generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
