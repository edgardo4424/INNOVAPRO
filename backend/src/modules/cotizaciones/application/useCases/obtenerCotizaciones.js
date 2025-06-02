const { formatearFechaIsoADMY } = require("../../infrastructure/helpers/formatearFecha");

module.exports = async (cotizacionRepository) => {
    const cotizaciones = await cotizacionRepository.obtenerCotizaciones(); // Llama al método del repositorio para obtener todos los cotizaciones
    
    const listaCotizaciones = cotizaciones.map((cotizacion) => {

        const {id, cliente, estados_cotizacion, obra, usuario, tipo_cotizacion, codigo_documento, ...resto} = cotizacion;

        return {
            id,
            cliente,
            estados_cotizacion,
            obra,
            usuario,
            tipo_cotizacion,
            codigo_documento
        }
    })

    return { codigo: 200, respuesta: listaCotizaciones } 
} 