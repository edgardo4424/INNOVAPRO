module.exports = async (periodo, anio, filial_id, gratificacionRepository) => {

      if (!['JULIO','DICIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: null }
    }

    const gratificaciones = await gratificacionRepository.calcularGratificaciones(periodo, anio, filial_id); 
    return { codigo: 200, respuesta: gratificaciones } 
} // Exporta la función para que pueda ser utilizada en otros módulos