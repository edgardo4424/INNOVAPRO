module.exports = async (obraRepository) => {
    const obras = await obraRepository.obtenerObras(); // Llama al método del repositorio para obtener todos los obras
    return { codigo: 200, respuesta: obras } 
} // Exporta la función para que pueda ser utilizada en otros módulos