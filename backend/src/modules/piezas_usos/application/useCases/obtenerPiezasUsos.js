module.exports = async (piezasUsosRepository) => {
    const piezasUsos = await piezasUsosRepository.obtenerPiezasUsos(); // Llama al método del repositorio para obtener todos las piezas usos
    return { codigo: 200, respuesta: piezasUsos } 
} // Exporta la función para que pueda ser utilizada en otros módulos