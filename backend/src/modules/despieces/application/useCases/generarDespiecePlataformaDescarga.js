const {
  generarDespiecePlataformaDescarga,
} = require("../../infrastructure/services/PlataformaDescarga/calcularCantidadesPlataformaDescarga");

module.exports = async (dataParaGenerarDespiece) => {
  const atributos = dataParaGenerarDespiece.atributos_formulario;

  const atributosFormularioFormateado = atributos.map((atributo) => ({
    ...atributo,
    capacidad: Number(atributo.capacidad),
  }));

  const despieceGenerado = await generarDespiecePlataformaDescarga(
    atributosFormularioFormateado
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso PLATAFORMA DE DESCARGA generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
