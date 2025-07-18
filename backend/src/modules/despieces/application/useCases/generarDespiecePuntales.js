const { generarDespiecePuntales } = require("../../infrastructure/services/Puntales/generarDespiecePuntalesService");

module.exports = async (dataParaGenerarDespiece) => {


  const dataGenerarDespiecePuntales = dataParaGenerarDespiece.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    cantidad: Number(atributo.cantidad),
  }))
  })))

  const despieceGenerado = await generarDespiecePuntales(
    dataGenerarDespiecePuntales
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso PUNTALES generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
