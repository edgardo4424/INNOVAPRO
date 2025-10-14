module.exports = async (fecha_anio_mes, filial_id, planillaQuincenalRepository) => {

    // validar fecha_anio_mes
    const [anio, mes] = fecha_anio_mes.split('-').map(Number);
    if (!anio || !mes || mes < 1 || mes > 12) {
      return { codigo: 400, respuesta: { mensaje: "Fecha inválida" } }
    }

    const planillaQuincenal = await planillaQuincenalRepository.calcularPlanillaQuincenal(fecha_anio_mes, filial_id); 

    return { codigo: 200, respuesta: planillaQuincenal } 
} // Exporta la función para que pueda ser utilizada en otros módulos