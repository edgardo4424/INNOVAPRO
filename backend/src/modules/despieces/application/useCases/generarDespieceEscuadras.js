const {
  generarDespieceEscuadras,
} = require("../../infrastructure/services/generarDespieceEscuadrasService");

module.exports = async (dataParaGenerarDespiece) => {
  const atributos = dataParaGenerarDespiece.atributos_formulario;

  const atributosFormularioFormateado = atributos.map((atributo) => ({
    ...atributo,
    escuadra: Number(atributo.escuadra),
    sobrecarga: Number(atributo.sobrecarga),
    factorSeguridad: Number(atributo.factorSeguridad),
    longTramo: Number(atributo.longTramo),
    cantidadEscuadrasTramo: Number(atributo.cantidadEscuadrasTramo)
  }));

  const despieceGenerado = await generarDespieceEscuadras(
    atributosFormularioFormateado
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso ESCUADRAS generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
