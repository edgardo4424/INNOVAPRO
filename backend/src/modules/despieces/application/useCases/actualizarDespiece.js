const Despiece = require("../../domain/entities/despiece"); // Importamos la clase Despiece

module.exports = async (id, despieceData, despieceRepository) => {
    const despiece = await despieceRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la despiece por ID
    if (!despiece) return { codigo: 404, respuesta: { mensaje: "Despiece no encontrada" } } // Si no se encuentra la despiece, retorna un error 404
    
    const errorCampos = Despiece.validarCamposObligatorios(despieceData, "editar"); // Validamos los campos obligatorios de la despiece
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const despieceActualizada = await despieceRepository.actualizarDespiece(id, despieceData)

   return { codigo: 200, respuesta: { mensaje: "Despiece actualizado correctamente", despiece: despieceActualizada } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos