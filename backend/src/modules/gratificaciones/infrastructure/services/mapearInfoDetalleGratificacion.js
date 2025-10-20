function mapearInfoDetalleGratificacion({asistencias, bonos, tipos_admitidos}) {

    // obtener info de horas extras

    const asistencias_con_horas_extras = asistencias.filter(a => a.horas_extras > 0).sort((a, b) => a.fecha.localeCompare(b.fecha));
    
    const info_horas_extras = asistencias_con_horas_extras.map(a => ({
        trabajador_id: a.trabajador_id,
        fecha: a.fecha,
        horas_extras: a.horas_extras,
    }))

    // Obtener info de bonos

    const info_bonos = bonos
        .filter( b => tipos_admitidos.includes(b.tipo))
        .map(b => ({
            trabajador_id: b.trabajador_id,
            fecha: b.fecha,
            monto: b.monto,
            tipo: b.tipo
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha))

    // Obtener info de faltas

    const asistencias_con_faltas = asistencias.filter(a => a.estado_asistencia == "falto").sort((a, b) => a.fecha.localeCompare(b.fecha))

    const info_faltas = asistencias_con_faltas.map(a => ({
        trabajador_id: a.trabajador_id,
        fecha: a.fecha,
    }))

    // Obtener info no computables (licencia_sin_goce)
    
    const asistencias_no_computables = asistencias.filter(a => a.estado_asistencia == "licencia_sin_goce").sort((a, b) => a.fecha.localeCompare(b.fecha))

    const info_no_computables = asistencias_no_computables.map(a => ({
        trabajador_id: a.trabajador_id,
        fecha: a.fecha,
    }))

   return {
    info_horas_extras,
    info_bonos,
    info_faltas,
    info_no_computables
   }

}

module.exports = {mapearInfoDetalleGratificacion}