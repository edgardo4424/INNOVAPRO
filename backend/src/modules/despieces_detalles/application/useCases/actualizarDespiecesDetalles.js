const DespieceDetalle = require("../../domain/entities/despieces_detalles"); // Importamos la clase DespieceDetalle

module.exports = async (id, despiecesDetallesData, despiecesDetallesRepository) => {
    const despiecesDetalles = await despiecesDetallesRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la despiecesDetalles por ID
    if (!despiecesDetalles) return { codigo: 404, respuesta: { mensaje: "Despieces Detalles no encontrada" } } // Si no se encuentra la obra, retorna un error 404
    
    const errorCampos = DespieceDetalle.validarCamposObligatorios(despiecesDetallesData, "editar"); // Validamos los campos obligatorios de la obra
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const despiecesDetallesActualizada = await despiecesDetallesRepository.actualizarDespieceDetalle(id, despiecesDetallesData)

   return { codigo: 200, respuesta: { mensaje: "Despieces Detalles actualizado correctamente", despieces_detalles: despiecesDetallesActualizada, status: 200 } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos