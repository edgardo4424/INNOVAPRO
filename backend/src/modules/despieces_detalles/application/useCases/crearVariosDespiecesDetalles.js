const DespieceDetalle = require("../../domain/entities/despieces_detalles"); // Clase entidad

module.exports = async (listaDespiecesDetallesData, despiecesDetallesRepository) => {
  // Validación de todos los registros
  for (const data of listaDespiecesDetallesData) {
    const errorCampos = DespieceDetalle.validarCamposObligatorios(data, "crear");
    if (errorCampos) {
      return {
        codigo: 400,
        respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
      };
    }
  }

  // Instanciar como entidades (opcional, pero recomendado si encapsulas lógica)
  const despiecesDetallesInstancias = listaDespiecesDetallesData.map(data => new DespieceDetalle(data));

  // Guardar todos en la base de datos
  const nuevosDespiecesDetalles = await despiecesDetallesRepository.crearVariosDespiecesDetalles(despiecesDetallesInstancias);

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Despieces detalles creados exitosamente",
      despieces_detalles: nuevosDespiecesDetalles,
    },
  };
};