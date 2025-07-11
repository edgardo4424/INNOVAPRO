const { generarDespiecePlataformaDescarga } = require("../../infrastructure/services/PlataformaDescarga/generarDespiecePlataformaDescargaService");

module.exports = async (dataParaGenerarDespiece) => {
  
   const dataGenerarDespiecePlataformaDescarga = dataParaGenerarDespiece.map((data) => (({
    ...data,
    atributos_formulario: data.atributos_formulario.map((atributo) => ({
    ...atributo,
    capacidad: Number(atributo.capacidad),
  }))
  })))

  const despieceGenerado = await generarDespiecePlataformaDescarga(
    dataGenerarDespiecePlataformaDescarga
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Despiece del Uso PLATAFORMA DE DESCARGA generado exitosamente",
      despieceGenerado: despieceGenerado,
    },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
