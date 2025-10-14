/**
    * Convierte una fecha a un índice año-mes en base 12.
    * Ej.: enero 2025 -> 2025*12 + 0
    * @param {Date|string|null} fecha
    * @returns {number|null} índice AAAA*12 + MM (MM: 0=Ene, 11=Dic)
*/
const indiceAnioMes = (fecha) => {
    if (!fecha) return null;
    const d = (fecha instanceof Date) ? fecha : new Date(fecha);
    if (isNaN(d)) return null;
    return d.getFullYear() * 12 + d.getMonth(); // 0 = Enero
};

/**
    * Limita una fecha al rango [min, max].
    * @param {Date|string} fecha
    * @param {Date} min
    * @param {Date} max
    * @returns {Date}
*/
const limitarFechaARango = (fecha, min, max) => {
    const x = new Date(fecha);
    if (x < min) return new Date(min);
    if (x > max) return new Date(max);
    return x;
};

/**
    * Cuenta meses calendario completos entre dos índices año-mes (inclusive).
    * @param {number|null} desdeYM índice de inicio (AAAA*12+MM)
    * @param {number|null} hastaYM índice de fin (AAAA*12+MM)
    * @returns {number} cantidad de meses (0 si inválido o invertido)
*/
const contarMesesEntreYM = (desdeYM, hastaYM) => {
    if (desdeYM == null || hastaYM == null) return 0;
    if (hastaYM < desdeYM) return 0;
    return (hastaYM - desdeYM + 1);
};

/**
 * Meses de AF para un contrato dentro del año, separados por corte.
 */
function calcularMesesAFPorContratoEnAnio({
    anio, mes, afDesde, fechaInicioContrato, fechaFinContrato, aplicaDesde
}) {
    const inicioAnio = new Date(anio, 0, 1);   // 1 Ene
    const finAnio    = new Date(anio, 11, 31); // 31 Dic

    if (!afDesde) return { previosMeses: 0, proyectadosMeses: 0 };

    const inicioAF = limitarFechaARango(afDesde, inicioAnio, finAnio);

    const inicioContrato = fechaInicioContrato
      ? limitarFechaARango(fechaInicioContrato, inicioAnio, finAnio)
      : inicioAnio;

    const finContrato = fechaFinContrato
      ? limitarFechaARango(fechaFinContrato, inicioAnio, finAnio)
      : finAnio;

    const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

    const interInicio = new Date(
        Math.max(inicioAF.getTime(), inicioContrato.getTime(), inicioAnio.getTime(), inicioCorte.getTime()));
    const interFin    = new Date(Math.min(finContrato.getTime(), finAnio.getTime()));
    if (interFin < interInicio) return { previosMeses: 0, proyectadosMeses: 0 };

    const ultimoDiaMesAnterior = new Date(anio, mes - 1, 0); 
    const primerDiaMesActual   = new Date(anio, mes - 1, 1);

    // --- Meses previos:
    const previosFin = new Date(Math.min(interFin.getTime(), ultimoDiaMesAnterior.getTime()));
    let previosMeses = 0;
    if (previosFin >= interInicio) {
      previosMeses = contarMesesEntreYM(indiceAnioMes(interInicio), indiceAnioMes(previosFin));
    }

    // --- Meses proyectados
    const projInicio = new Date(Math.max(interInicio.getTime(), primerDiaMesActual.getTime()));
    let proyectadosMeses = 0;
    if (interFin >= projInicio) {
      proyectadosMeses = contarMesesEntreYM(indiceAnioMes(projInicio), indiceAnioMes(interFin));
    }
    return { previosMeses, proyectadosMeses };
}

/**
    * Divide los meses de un contrato dentro del año en:
    *  - previosMeses: desde interInicio hasta el último día del mes anterior
    *  - proyectadosMeses: desde el primer día del mes actual hasta interFin
*/
function splitMesesContratoPorCorte({ anio, mes, fechaInicioContrato, fechaFinContrato, aplicaDesde }) {
    const inicioAnio = new Date(anio, 0, 1);
    const finAnio    = new Date(anio, 11, 31);

    const inicio = fechaInicioContrato ? new Date(fechaInicioContrato) : inicioAnio;
    const fin    = fechaFinContrato   ? new Date(fechaFinContrato)    : finAnio;

    const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

    const interInicio = new Date(Math.max(inicio.getTime(), inicioAnio.getTime(), inicioCorte.getTime()));
    const interFin    = new Date(Math.min(fin.getTime(), finAnio.getTime()));
    if (interFin < interInicio) return { previosMeses: 0, proyectadosMeses: 0 };

    const ultimoDiaMesAnterior = new Date(anio, mes - 1, 0);
    const primerDiaMesActual   = new Date(anio, mes - 1, 1);

    const previosFin = new Date(Math.min(interFin.getTime(), ultimoDiaMesAnterior.getTime()));
    let previosMeses = 0;
    if (previosFin >= interInicio) {
      previosMeses = contarMesesEntreYM(indiceAnioMes(interInicio), indiceAnioMes(previosFin));
    }

    const projInicio = new Date(Math.max(interInicio.getTime(), primerDiaMesActual.getTime()));
    let proyectadosMeses = 0;
    if (interFin >= projInicio) {
      proyectadosMeses = contarMesesEntreYM(indiceAnioMes(projInicio), indiceAnioMes(interFin));
    }

    return { previosMeses, proyectadosMeses };
}

/**
 * Valor “gravado” de gratificación priorizando campos reales > semestral > totales.
 */
const valorGrati = (fila) => {
    if (!fila) return 0;
    const valor = fila.dataValues ? fila.dataValues : fila;
    const num = (v) => (v == null ? null : Number(v));
    return (
        num(valor.total_a_pagar) ??
        0
    );
};

/**
 * Normaliza respuesta del repo de grati para un trabajador dado.
 * Acepta: instancia, lista, planilla.trabajadores, listaTrabajadores, etc.
 */
const elegirFilaPorTrabajador = (respuesta, trabajadorId) => {
    if (!respuesta) return null;

    if (respuesta.dataValues) return respuesta;

    const lista =
        (respuesta.planilla && 
            Array.isArray(respuesta.planilla.trabajadores) && 
            respuesta.planilla.trabajadores) ||
        (Array.isArray(respuesta.listaTrabajadores) && respuesta.listaTrabajadores) ||
        (Array.isArray(respuesta) && respuesta) ||
        null;
          
    if (lista) {
      const found =
        lista.find(
            (trabajador) => Number((trabajador.dataValues?.trabajador_id ?? trabajador.trabajador_id)) === Number(trabajadorId)
        ) || lista[0];
      if (!found) {
        const err = new Error("No se encontró trabajador en lista de gratificaciones"); 
        return err;
      }
        return found || null;
      }
      return null;
  };
  
/**
 * Devuelve real/trunca/usado/proj para una filial dada (reglas por mes y DJ).
 */
async function _gratiPorFilial({ anio, mes, filialId, trabajadorId, gratiRepo, elegirFilaPorTrabajador, valorGrati, aplicaDesde }) {
    // Real
    const gJRealResp = await gratiRepo.obtenerGratificacionPorTrabajador("JULIO", anio, filialId, trabajadorId);
    const gDRealResp = await gratiRepo.obtenerGratificacionPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);
    // Trunca
    const gJTruResp  = await gratiRepo.calcularGratificacionTruncaPorTrabajador("JULIO", anio, filialId, trabajadorId);
    const gDTruResp  = await gratiRepo.calcularGratificacionTruncaPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);

    const filaJReal = elegirFilaPorTrabajador(gJRealResp);
    const filaDReal = elegirFilaPorTrabajador(gDRealResp);
    const filaJTru  = elegirFilaPorTrabajador(gJTruResp);
    const filaDTru  = elegirFilaPorTrabajador(gDTruResp);

    const julioReal   = valorGrati(filaJReal);
    const dicReal     = valorGrati(filaDReal);
    const julioTrunca = valorGrati(filaJTru);
    const dicTrunca   = valorGrati(filaDTru);

    // “Usado” según reglas por mes (real si hay; si no, trunca)
    let usadoJulio = 0, usadoDiciembre = 0, julioProj = 0, dicProj = 0;
    if (mes <= 6) {
      // Proyección (no se suma como pagado)
      julioProj = Number(julioTrunca || 0);
      dicProj   = Number(dicTrunca   || 0);
    } else if (mes >= 7 && mes <= 11) {
      usadoJulio = Number((julioReal && julioReal > 0 ? julioReal : julioTrunca) || 0);
      dicProj    = Number(dicTrunca || 0);
    } else {
      usadoJulio     = Number((julioReal && julioReal > 0 ? julioReal : julioTrunca) || 0);
      usadoDiciembre = Number((dicReal   && dicReal   > 0 ? dicReal  : dicTrunca)   || 0);
    }

    // Recorte por DJ: si el corte es agosto o después, NUNCA se considera julio pagado
    if (aplicaDesde && aplicaDesde > 7) {
      usadoJulio = 0;
    }

    return {
      filial_id: Number(filialId),
      julio:     { real: Number(julioReal||0), trunca: Number(julioTrunca||0), usado: Number(usadoJulio||0), proj: Number(julioProj||0) },
      diciembre: { real: Number(dicReal||0),   trunca: Number(dicTrunca||0),   usado: Number(usadoDiciembre||0), proj: Number(dicProj||0) }
    };
}

module.exports = {
    calcularMesesAFPorContratoEnAnio,
    splitMesesContratoPorCorte,
    valorGrati,
    _gratiPorFilial,
    elegirFilaPorTrabajador,
}