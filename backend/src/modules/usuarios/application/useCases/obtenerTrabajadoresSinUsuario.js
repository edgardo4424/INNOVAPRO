module.exports = async (usuarioRepository) => {
    const trabajadoresSinUsuario = await usuarioRepository.obtenerTrabajadoresSinUsuario(); // Llama al método del repositorio para obtener todos los trabajadoresSinUsuario
    return { codigo: 200, respuesta: trabajadoresSinUsuario } 
} // Exporta la función para que pueda ser utilizada en otros módulos