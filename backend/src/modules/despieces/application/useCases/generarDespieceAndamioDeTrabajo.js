
const { generarDespieceAndamioTrabajo } = require("../../infrastructure/services/generarDespieceAndamioTrabajoService");

module.exports = async (dataParaGenerarDespiece) => {
 
    const atributos = dataParaGenerarDespiece.atributos_formulario;
    
    const despieceGenerado = await generarDespieceAndamioTrabajo(atributos)

  return {
    codigo: 200,
    respuesta: { mensaje: "Despiece del Uso ANDAMIO DE TRABAJO generado exitosamente", despieceGenerado:  despieceGenerado},
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
