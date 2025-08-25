const moment = require('moment-timezone');
const { factorPorRegimen } = require('./calcularMesesComputablesSemestre');

function mapearParaRegistrarTablaGratificaciones(registros, periodo, anio, filial_id, usuario_cierre_id, cierre_id) {

    let periodoGrati;


    switch (periodo) {
        case "JULIO":
            periodoGrati = `${anio}-07`;
            break;
        case "DICIEMBRE":
            periodoGrati = `${anio}-12`;
            break;
        default:
            break;
    }


  return registros.map(r => {
   
    return {
    trabajador_id: r.trabajador_id,
    tipo_contrato: r.tipo_contrato,
    periodo: periodoGrati,
    fecha_calculo: moment().tz('America/Lima').format('YYYY-MM-DD'),
    regimen: r.regimen,
    factor_regimen: factorPorRegimen(r.regimen),
    sueldo_base: r.sueldo_base,
    asignacion_familiar: r.asignacion_familiar,
    promedio_horas_extras: r.prom_horas_extras,
    promedio_bono_obra: r.bono_obra,
    remuneracion_computable: r.sueldo_bruto,
    meses_computables: Number(r?.tiempo_laborado.split(" ")[0]),
    gratificacion_bruta: r.gratificacion_semestral,
    faltas_dias: r.falta_dias,
    faltas_monto: -(r.falta_importe),
    no_computable: r.no_computable,
    gratificacion_neta: r.grat_despues_descuento,
    bonificacion_extraordinaria: r.bonificac_essalud,
    renta_5ta: r.rent_quint_cat_no_domiciliado,
    adelantos: r.mont_adelanto,
    total_pagar: r.total_a_pagar,
    locked_at: moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss'),
    usuario_cierre_id: usuario_cierre_id,
    filial_id: filial_id,
    cierre_id: cierre_id
  }})
}

module.exports = {mapearParaRegistrarTablaGratificaciones }