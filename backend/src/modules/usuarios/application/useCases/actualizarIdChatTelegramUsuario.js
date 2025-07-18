
module.exports = async (id, usuarioData, usuarioRepository) => {

    const usuarioExistente = await usuarioRepository.obtenerPorId(id); // Buscamos el usuario por ID
    if (!usuarioExistente) return { codigo: 404, respuesta: { mensaje: "Usuario no encontrado" } } // Si no se encuentra el usuario, retorna un error 404
 
    const usuarioActualizado = await usuarioRepository.actualizarIdChatTelegramUsuario(id, usuarioData.id_chat)
  
    return { codigo: 200, respuesta: { mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado } } // Retornamos el cliente creado
} // Exporta la función para que pueda ser utilizada en otros módulos