const Obra = require("../../domain/entities/obra"); // Importamos la clase Obra

module.exports = async (id, obraData, obraRepository) => {
    const obra = await obraRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la obra por ID
    if (!obra) return { codigo: 404, respuesta: { mensaje: "Obra no encontrada" } } // Si no se encuentra la obra, retorna un error 404
    
    const errorCampos = Obra.validarCamposObligatorios(obraData, "editar"); // Validamos los campos obligatorios de la obra
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const obraActualizada = await obraRepository.actualizarObra(id, obraData)

   return { codigo: 200, respuesta: { mensaje: "Obra actualizado correctamente", obra: obraActualizada } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos