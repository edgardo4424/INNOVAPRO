const Tarea = require("../../domain/entities/tarea"); // Importamos la clase Tarea

module.exports = async (id, tareaData, tareaRepository) => {
    const tarea = await tareaRepository.obtenerPorId(id); // Llama al método del repositorio para obtener la tarea por ID
    if (!tarea) return { codigo: 404, respuesta: { mensaje: "Tarea no encontrada" } } // Si no se encuentra la tarea, retorna un error 404
    
    const errorCampos = Tarea.validarCamposObligatorios(tareaData, "editar"); // Validamos los campos obligatorios de la tarea
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Si hay un error en los campos, retornamos un error 400

    const tareaActualizada = await tareaRepository.actualizarTarea(id, tareaData)

   return { codigo: 200, respuesta: { mensaje: "Tarea actualizado correctamente", tarea: tareaActualizada } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos