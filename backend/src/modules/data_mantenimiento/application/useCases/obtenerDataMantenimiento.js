module.exports = async (dataMantenimientoRepository) => {
    const dataMantenimiento = await dataMantenimientoRepository.obtenerDataMantenimiento(); // Llama al método del repositorio para obtener todos los dataMantenimiento
    return { codigo: 200, respuesta: dataMantenimiento } 
} // Exporta la función para que pueda ser utilizada en otros módulos