module.exports = async (periodo, anio, filial_id, ctsRepository) => {

      if (!['MAYO','NOVIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: null }
    }    
    const cts = await ctsRepository.calcularCts(periodo, anio, filial_id); 
    return { codigo: 200, respuesta: cts } 
} 