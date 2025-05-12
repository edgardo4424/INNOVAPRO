const Despiece = require("../../domain/entities/despiece"); // Importamos la clase Despiece

module.exports = async (despieceData, despieceRepository) => {
  const errorCampos = Despiece.validarCamposObligatorios(despieceData, "crear"); // Validamos los campos obligatorios de la despiece
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  const nuevaDespieceData = new Despiece(despieceData); // Creamos una nueva instancia de la clase despiece con los datos proporcionados
  const nuevoDespiece = await despieceRepository.crear(nuevaDespieceData); // Creamos el nuevo despiece con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Despiece creado exitosamente", despiece: nuevoDespiece },
  }; // Retornamos el despiece creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
