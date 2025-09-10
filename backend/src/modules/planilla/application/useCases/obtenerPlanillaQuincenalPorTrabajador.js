module.exports = async (fecha_anio_mes, filial_id, trabajador_id, planillaRepository) => {

    const planillaQuincenal = await planillaRepository.obtenerPlanillaQuincenalPorTrabajador(fecha_anio_mes, filial_id, trabajador_id); // Llama al método del repositorio para obtener todos los planillaQuincenal
    return { codigo: 200, respuesta: planillaQuincenal } 
} // Exporta la función para que pueda ser utilizada en otros módulos