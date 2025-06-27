module.exports = async (stockRepository) => {
    const stock = await stockRepository.obtenerStockPiezasPorEstado(); // Llama al método del repositorio para obtener todos los usuarios
    return { codigo: 200, respuesta: stock } 
} 