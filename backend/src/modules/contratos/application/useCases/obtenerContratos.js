module.exports = async (contratoRepository) => {
    const contratos = await contratoRepository.obtenerContratos(); // Llama al método del repositorio para obtener todos los contratos
  
    return { codigo: 200, respuesta: contratos } 
} // Exporta la función para que pueda ser utilizada en otros módulos