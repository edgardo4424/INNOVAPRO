module.exports = async (codigo, dataMantenimientoRepository) => {    
    const dataMantenimiento = await dataMantenimientoRepository.obtenerDataMantenimientoPorCodigoImporte(codigo); // Llama al método del repositorio para obtener un dataMantenimiento por ID
    if (!dataMantenimiento) return { codigo: 404, respuesta: { mensaje: "Data de mantenimiento no encontrado" } } // Si no se encuentra el dataMantenimiento, retorna un error 404

    return { codigo: 200, respuesta: dataMantenimiento } // Retorna el dataMantenimiento encontrado
} // Exporta la función para que pueda ser utilizada en otros módulos