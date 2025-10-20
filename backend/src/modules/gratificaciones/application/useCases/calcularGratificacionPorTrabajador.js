module.exports = async (periodo, anio, filial_id, trabajador_id, gratificacionRepository) => {

      if (!['JULIO','DICIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: null }
    }

    const gratificacionPorTrabajador = await gratificacionRepository.calcularGratificacionTruncaPorTrabajador(periodo, anio, filial_id, trabajador_id); 
    return { codigo: 200, respuesta: gratificacionPorTrabajador } 
} // Exporta la función para que pueda ser utilizada en otros módulos