const {
  proyectarIngresosAnuales,
  calcularRetencionBaseMes,
  calcularRetencionAdicionalMes,
  getParametrosTributarios
} = require('../../shared/utils/tax/calculadorQuinta');

module.exports = class CalcularQuintaProyectada {
  async execute(input) {
    const {
      dni,
      trabajadorId,
      anio, 
      mes, 
      contratoId, 
      remuneracionMensualActual,
      ingresos_previos_internos,
      retenciones_previas_internas,
      ingresosPrevios,
      retencionesPrevias,
      esProyeccion,
      fuentePrevios,
      otrosIngresosProyectados,
      deduccionAdicionalAnual = 0,
      agregadoTodasFiliales = false,
      creadoPor,
    } = input;
    
    const { total_ingresos, gratiJulioProj, gratiJulioTrabajador, gratiDiciembreTrabajador, gratiDiciembreProj, bonos, asignacion_familiar, extraGravadoMes, grati_multi, af_multi, remu_multi} = ingresosPrevios;

    const ingresosPreviosAcumulados = total_ingresos;

    let gratiJulioProyectada = gratiJulioProj;
    let gratiDiciembreProyectada = gratiDiciembreProj; 
    let gratiJulioPagada = gratiJulioTrabajador;
    let gratiDiciembrePagada = gratiDiciembreTrabajador;

    if (mes <= 6) {
      // Todavía no ocurre julio ni diciembre
      gratiJulioPagada = 0;
      gratiDiciembrePagada = 0;
    } else if (mes >= 7 && mes <= 11) {
      // Julio ya está en ingresos previos
      gratiJulioProyectada = 0;
      gratiDiciembrePagada = 0;
    } else if (mes === 12) {
      // Ambas ya fueron pagadas
      gratiJulioProyectada = 0;
      gratiDiciembreProyectada = 0;
    }

    // Lee uit y deduccion fija 
    const parametros = await getParametrosTributarios();

    // Proyectamos el ingreso bruto anual = sueldo x meses faltantes + gratificaciones + otros ingresos.
    const brutoAnualProyectado = proyectarIngresosAnuales({
      mes, remuneracionMensualActual, ingresosPreviosAcumulados, ingresos_previos_internos,
      gratiJulioProyectada, gratiDiciembreProyectada, otrosIngresosProyectados, grati_multi, af_multi,
      remu_multi, fuentePrevios, asignacion_familiar_proj_actual: Number(ingresosPrevios.asignacion_familiar_proj || 0),
    }); 

    // Calculamos la retención base del mes
    const base = calcularRetencionBaseMes({
      anio,
      mes,
      brutoAnualProyectado,
      retencionesAcumuladas: retencionesPrevias,
      deduccionAdicionalAnual: deduccionAdicionalAnual,
      parametros
    });

    let retencionAdicionalMes = 0;
    if (base.retencionBaseMes !== 0) {
        // Calculamos la retención adicional del mes en caso de ingresos extraordinarios(bonos, horas extras, etc)
        retencionAdicionalMes = calcularRetencionAdicionalMes({
          anio,
          rentaNetaAnual: base.rentaNetaAnual,
          montoExtraGravadoMes: extraGravadoMes,
          parametros
      });
    } 

    // Generación de warnings
    const warnings = [];

    // Caso 1: es una proyección
    if (esProyeccion && mes > 1) {
      warnings.push("No existen ingresos previos reales, se está usando una proyección.");
    } else {
      // SEñales según la fuente elegida
      if (fuentePrevios === 'AUTO' && mes > 1) {
        warnings.push("Ingresos previos estimados automáticamente (proyección).");
      } else if (fuentePrevios === 'SIN_PREVIOS' && mes > 1) {
        warnings.push("Se consideraron ingresos previos = 0 por declaración jurada.");
      } else if (fuentePrevios === 'CERTIFICADO' && mes > 1) {
        warnings.push("Ingresos previos declarados vía Certificado de 5ta.");
      } else if (!esProyeccion) {
        // Caso 2: renta neta anual menor a 7 UIT
        if (base.rentaNetaAnual <= parametros.uit * parametros.deduccionFijaUit) {
          warnings.push("La renta neta anual no supera 7 UIT, no corresponde retención este mes.");
        }
      }

    }

    // Caso 3: retenciones previas vacías
    if (mes > 1 && (!retencionesPrevias || retencionesPrevias === 0)) {
      warnings.push("No se encontraron retenciones previas registradas, se considera 0.");
    }
    
    // Caso 4: no se generó retención pese a superar 7 UIT
    if (base.rentaNetaAnual > parametros.uit * parametros.deduccionFijaUit &&
      base.retencionBaseMes === 0 && retencionAdicionalMes === 0) {
      warnings.push("El cálculo no genera retención este mes, verifique divisor y proyección.");
    }

    return {
      // Identificación del trabajador
      trabajador_id: trabajadorId || null,
      contrato_id: input.contratoId || null,
      dni,
      anio,
      mes,

      // Entradas (parámetros que entraron al cálculo)
      remuneracion_mensual: remuneracionMensualActual,
      ingresos_previos_acum: (fuentePrevios === "SIN_PREVIOS") ? 0 : Number(ingresosPreviosAcumulados),
      grati_julio_proj: gratiJulioProyectada,
      grati_diciembre_proj: gratiDiciembreProyectada,
      otros_ingresos_proj: otrosIngresosProyectados,
      extra_gravado_mes: extraGravadoMes,

      // Cálculos intermedios
      bruto_anual_proyectado: brutoAnualProyectado,
      renta_neta_anual: base.rentaNetaAnual,
      impuesto_anual: base.impuestoTotal,
      divisor_calculo: base.divisor,
      tramos_usados: base.tramos_usados,

      // Resultados del mes
      retenciones_previas: retencionesPrevias,
      retencion_base_mes: base.retencionBaseMes,
      retencion_adicional_mes: retencionAdicionalMes,

      // Parámetros tributarios aplicados
      uit_valor: parametros.uit,
      deduccion_fija_uit: parametros.deduccionFijaUit,

      // Metadata
      es_recalculo: false,
      fuente: 'informativo',
      creado_por: creadoPor || null,

      // Advertencias
      warnings
    };

  }
};