const { formatearFechaIsoADMY } = require("../../infrastructure/helpers/formatearFecha");

module.exports = async (cotizacionRepository) => {
    const cotizaciones = await cotizacionRepository.obtenerCotizaciones(); // Llama al método del repositorio para obtener todos los cotizaciones
    
   /*  const listaCotizaciones = cotizaciones.legnth>0 && cotizaciones.map((cotizacion) => (({
        id: cotizacion.id,
        fecha: formatearFechaIsoADMY(cotizacion.updatedAt),
        
    }))) */
    
    return { codigo: 200, respuesta: cotizaciones } 
} 