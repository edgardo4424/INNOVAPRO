const Pieza = require("../../domain/entities/pieza"); // Importamos la clase Pieza

module.exports = async (id, piezaData, piezaRepository) => {
    const pieza = await piezaRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la pieza por ID
    if (!pieza) return { codigo: 404, respuesta: { mensaje: "Pieza no encontrada" } } // Si no se encuentra la pieza, retorna un error 404
    
    const errorCampos = Pieza.validarCamposObligatorios(piezaData, "editar"); // Validamos los campos obligatorios de la pieza
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const piezaActualizado = await piezaRepository.actualizarPieza(id, piezaData)

   return { codigo: 200, respuesta: { mensaje: "Pieza actualizada correctamente", pieza: piezaActualizado } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos