function mapearInfoDetalleGratificacion({asistencias, bonos}) {

    console.log('asistecias', asistencias);
    // obtener info de horas extras

    const asistencias_con_horas_extras = asistencias.filter(a => a.horas_extras > 0).sort((a, b) => a.fecha.localeCompare(b.fecha));
    
    console.log('asistencias_con_horas_extras', asistencias_con_horas_extras);
    const info_horas_extras = asistencias_con_horas_extras.map(a => ({
        trabajador_id: a.trabajador_id,
        fecha: a.fecha,
        horas_extras: a.horas_extras,
    }))

    // Obtener info de bonos

    const info_bonos = bonos
        .map(b => ({
            trabajador_id: b.trabajador_id,
            fecha: b.fecha,
            monto: b.monto
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha))

    // Obtener info de faltas

    const asistencias_con_faltas = asistencias.filter(a => a.estado_asistencia == "falto").sort((a, b) => a.fecha.localeCompare(b.fecha))

    const info_faltas = asistencias_con_faltas.map(a => ({
        trabajador_id: a.trabajador_id,
        fecha: a.fecha,
    }))

    // Obtener info no computables
    

   return {
    info_horas_extras,
    info_bonos,
    info_faltas
   }

}

module.exports = {mapearInfoDetalleGratificacion}