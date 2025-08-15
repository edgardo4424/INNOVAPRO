const { obtenerUltimaFechaFin } = require("./calcularMesesComputablesSemestre");

function mapearParaReporteGratificaciones(trabajadoresRaw) {
  return trabajadoresRaw.flatMap(t => {

    return t.partes_por_regimen.map(parte => {

      const fila = {
        tipo_documento: t.tipo_documento,
        numero_documento: t.numero_documento,
        nombres: t.nombres,
        apellidos: t.apellidos,
        tipo_contrato: parte.tipo_contrato,
        regimen: parte.regimen,
        fecha_ingreso: parte.fecha_inicio, // NUEVO CAMPO
        fecha_fin: parte.fecha_fin,
        tiempo_laborado: `${parte.meses.toString().padStart(2, '0')} MESES`,
        sueldo_base: parte.sueldo_base.toFixed(2),
        asig_familiar: (parte.asignacion_familiar || 0).toFixed(2),
        prom_horas_extras: (parte.promedio_horas_extras || 0).toFixed(2),
        prom_bono_obra: (parte.promedio_bono_obra || 0).toFixed(2),
        sueldo_bruto: parte.rc.toFixed(2),
        gratificacion_semestral: parte.gratificacion_bruta.toFixed(2),
        falta_dias: (parte.faltas_dias || 0).toString(),
        falta_importe: (-parte.faltas_monto).toFixed(2),
        no_computable: (t.no_computable || 0).toFixed(2),
        grat_despues_descuento: parte.gratificacion_neta.toFixed(2),
        bonificac_essalud: parte.bonificacion_extraordinaria.toFixed(2),
        rent_quint_cat: (parte.renta_5ta || 0).toFixed(2),
        mont_adelanto: (parte.adelantos || 0).toFixed(2),
        total_a_pagar: parte.total.toFixed(2)
      };
      return fila;
    });
  });
}

module.exports = {mapearParaReporteGratificaciones }