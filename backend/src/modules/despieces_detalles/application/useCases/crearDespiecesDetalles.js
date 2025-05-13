const DespieceDetalle = require("../../domain/entities/despieces_detalles"); // Importamos la clase DespieceDetalle

module.exports = async (despiecesDetallesData, despiecesDetallesRepository) => {
  const errorCampos = DespieceDetalle.validarCamposObligatorios(despiecesDetallesData, "crear"); // Validamos los campos obligatorios de la DespieceDetalle
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  const nuevaDespiecesDetallesData = new DespieceDetalle(despiecesDetallesData); // Creamos una nueva instancia de la clase ObrDespieceDetalle con los datos proporcionados
  const nuevoDespiecesDetalles = await despiecesDetallesRepository.crear(nuevaDespiecesDetallesData); // Creamos el nuevo DespieceDetalle con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Despiece detalles creado exitosamente", despieces_detalles: nuevoDespiecesDetalles },
  }; 
}; // Exporta la función para que pueda ser utilizada en otros módulos
