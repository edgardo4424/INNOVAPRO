module.exports = async (id, usuarioData, usuarioRepository, entidadService) => {
   
    const errorCampos = entidadService.validarCamposObligatorios(usuarioData, 'editar');
    
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Validamos campos obligatorios

   const usuarioActualizado = await usuarioRepository.actualizarUsuario(id, usuarioData)


   return { codigo: 200, respuesta: { mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado } } // Retornamos el cliente creado

} // Exporta la función para que pueda ser utilizada en otros módulos