const moment = require('moment-timezone');

function mapearParaRegistrarTablaCts(registros, periodo, anio, filial_id, usuario_cierre_id, cierre_id) {

    let periodoCts;


    switch (periodo) {
        case "MAYO":
            periodoCts = `${anio}-05`;
            break;
        case "NOVIEMBRE":
            periodoCts = `${anio}-11`;
            break;
        default:
            break;
    }


  return registros.map(r => {
   console.log('r', r);
    return {
    trabajador_id: r.trabajador_id,
    contratos: r.ids_agrupacion ? r.ids_agrupacion : r.contrato_id,
    periodo: periodoCts,
    regimen: r.regimen,
    fecha_ingreso: r.fecha_ingreso,
    inicio_periodo: r.inicio_periodo,
    fin_periodo: r.fin_periodo,
    sueldo_base: r.sueldo_basico,
    asignacion_familiar: r.sueldo_asig_fam,
     promedio_horas_extras: r.prom_h_extras,
    promedio_bono_obra: r.prom_bono,
    remuneracion_computable: r.remuneracion_comp,
    ultima_gratificacion: r.ultima_gratificacion,
    sexto_gratificacion: r.sexto_gratificacion,
    meses_computables: r.meses_comp,
    dias_computables: r.dias_comp,
    cts_meses: r.cts_meses,
    cts_dias: r.cts_dias,
    faltas_dias: r.faltas_dias,
    faltas_importe: r.faltas_importe,
    no_computable: r.no_computable,
    no_domiciliado: r.no_domiciliado,
    cts_depositar: r.cts_depositar,
    numero_cuenta: r.numero_cuenta,
    banco: r.banco,
    locked_at: moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss'),
    usuario_cierre_id: usuario_cierre_id,
    filial_id: filial_id,
    cierre_id: cierre_id,
  }})
}

module.exports = {mapearParaRegistrarTablaCts }