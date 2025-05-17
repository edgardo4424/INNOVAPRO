module.exports = async (piezaRepository) => {
    const piezas = await piezaRepository.obtenerPiezas(); // Llama al método del repositorio para obtener todos los obras
    return { codigo: 200, respuesta: piezas } 
} // Exporta la función para que pueda ser utilizada en otros módulos