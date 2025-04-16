module.exports = async (id, obraData, obraRepository, entidadService) => {
   
    const errorCampos = entidadService.validarCamposObligatorios(obraData);
    
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Validamos campos obligatorios

    const obra = await obraRepository.obtenerPorId(id); // Llama al método del repositorio para obtener el obra por ID
   
    if (!obra) return { codigo: 404, respuesta: { mensaje: "Obra no encontrado" } } // Si no se encuentra el obra, retorna un error 404

   const obraActualizado = await obraRepository.actualizarObra(id, obraData)

   return { codigo: 200, respuesta: { mensaje: "Obra actualizado correctamente", obra: obraActualizado } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos