module.exports = async (periodo, anio, filial_id, ctsRepository,trabajador_id) => {

      if (!['MAYO','NOVIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: null }
    }    
    const cts = await ctsRepository.calcularCtsIndividual(periodo, anio, filial_id,trabajador_id); 
    return { codigo: 200, respuesta: cts } 
} 