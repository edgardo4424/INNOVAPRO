module.exports = async (usoRepository) => {
    const usos = await usoRepository.obtenerUsos(); // Llama al método del repositorio para obtener todos los usos
    return { codigo: 200, respuesta: usos } 
} // Exporta la función para que pueda ser utilizada en otros módulos