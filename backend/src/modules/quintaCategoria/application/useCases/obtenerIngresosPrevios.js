const { Op } = require("sequelize");
const { FUENTE_PREVIOS } = require('../../shared/constants/tributario/quinta');
const {
  getParametrosTributarios,
  confirmarParametrosTributarios
} = require('../../shared/utils/tax/calculadorQuinta');

const { ContratoLaboral } = require("../../../contratos_laborales/infraestructure/models/contratoLaboralModel");

class ObtenerIngresosPrevios {
  constructor({ quintaRepo, bonoRepo, gratiRepo, asistenciaRepo } = {}) {
    if (quintaRepo && bonoRepo && gratiRepo && asistenciaRepo) {
      this.quintaRepo = quintaRepo;
      this.bonoRepo = bonoRepo;
      this.gratiRepo = gratiRepo;
      this.asistenciaRepo = asistenciaRepo;
    } else {
      const SequelizeQuintaCategoriaRepository = require("../../infrastructure/repositories/SequelizeQuintaCategoriaRepository");
      const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");
      const SequelizeGratificacionRepository = require("../../../gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");
      const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");

      this.quintaRepo = quintaRepo || new SequelizeQuintaCategoriaRepository();
      this.bonoRepo = bonoRepo || new SequelizeBonoRepository();
      this.gratiRepo = gratiRepo || new SequelizeGratificacionRepository();
      this.asistenciaRepo = asistenciaRepo || new SequelizeAsistenciaRepository();
    }
  }

  async execute({
    trabajadorId,
    dni,                       
    anio, mes,
    remuneracionMensualActual,
    fuentePrevios,
    certificadoQuinta,
    filialIdPreferida,         
    contratoId,
    asignacion_familiar,  
    asignacion_familiar_desde, 
    sinPreviosAplicaDesde,             
  }) {
    console.log("TRABAJADOR ID EN OBTENER INGRESOS PREV: ", trabajadorId)
    console.log("DNI EN OBTENER INGRESOS PREV: ", dni)
    console.log("AÑO  EN OBTENER INGRESOS PREV: ", anio)
    console.log("MES EN OBTENER INGRESOS PREV: ", mes)
    console.log("REMUNERACION MENSUAL ACTUAL EN OBTENER INGRESOS PREV: ", remuneracionMensualActual)
    console.log("FUENTE PREVIOS EN OBTENER INGRESOS PREV: ", fuentePrevios)
    console.log("CERTIFICADO QUINTA ID EN OBTENER INGRESOS PREV: ", certificadoQuinta)
    console.log("FILIAL ID PREFERIDA EN OBTENER INGRESOS PREV: ", filialIdPreferida)
    console.log("CONTRATO ID EN OBTENER INGRESOS PREV: ", contratoId)
    console.log("TIENE ASIGNACION FAMILIAR EN OBTENER INGRESOS PREV: ", asignacion_familiar, "DESDE :", asignacion_familiar_desde)

    const sueldoBase = Number(remuneracionMensualActual ?? 0);
    const aplicaDesde = Number(sinPreviosAplicaDesde || 0) || null;

    const pad2 = (n) => String(n).padStart(2, "0");
    const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

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
     * Calcula cuántos meses de Asignación Familiar (AF) corresponden:
     * - previosMeses: meses hasta el mes anterior al corte (inclusive)
     * - proyectadosMeses: meses desde el mes del corte hasta el fin de vigencia
     *
     * Considera:
     *   - Fecha desde la que aplica AF (afDesde)
     *   - Periodo anual (anio, mes de corte)
     *   - Rango del contrato dentro del año (fechaInicioContrato/fechaFinContrato)
     *
     * @param {Object} p
     * @param {number} p.anio                 Año de cálculo (YYYY)
     * @param {number} p.mes                  Mes de corte (1-12)
     * @param {Date|string|null} p.afDesde    Fecha desde la que aplica AF (puede ser < o > al año)
     * @param {Date|string|null} p.fechaInicioContrato  Inicio del contrato (puede ser nulo)
     * @param {Date|string|null} p.fechaFinContrato     Fin del contrato (puede ser nulo)
     * @returns {{ previosMeses: number, proyectadosMeses: number }}
     */
    function calcularMesesAFPorContratoEnAnio({
      anio, mes, afDesde, fechaInicioContrato, fechaFinContrato, aplicaDesde
    }) {
      // Rango del año
      const inicioAnio = new Date(anio, 0, 1);   // 1 Ene
      const finAnio    = new Date(anio, 11, 31); // 31 Dic

      // Si no hay AF, todo 0
      if (!afDesde) {
        return { previosMeses: 0, proyectadosMeses: 0 };
      }

      // AF acotada al año
      const inicioAF = limitarFechaARango(afDesde, inicioAnio, finAnio);

      // Rango del contrato acotado al año
      const inicioContrato = fechaInicioContrato
        ? limitarFechaARango(fechaInicioContrato, inicioAnio, finAnio)
        : inicioAnio;

      const finContrato = fechaFinContrato
        ? limitarFechaARango(fechaFinContrato, inicioAnio, finAnio)
        : finAnio;

      const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

      // Intersección efectiva dentro del año en que hay contrato y AF
      const interInicio = new Date(Math.max(inicioAF.getTime(), inicioContrato.getTime(), inicioAnio.getTime(), inicioCorte.getTime()));
      const interFin    = new Date(Math.min(finContrato.getTime(), finAnio.getTime()));
      if (interFin < interInicio) return { previosMeses: 0, proyectadosMeses: 0 };

      // Cortes del período
      const ultimoDiaMesAnterior = new Date(anio, mes - 1, 0); // último día del mes anterior
      const primerDiaMesActual   = new Date(anio, mes - 1, 1); // primer día del mes actual

      // --- Meses previos: interInicio .. min(interFin, último día mes anterior)
      const previosFin = new Date(Math.min(interFin.getTime(), ultimoDiaMesAnterior.getTime()));

      let previosMeses = 0;
      if (previosFin >= interInicio) {
        previosMeses = contarMesesEntreYM(indiceAnioMes(interInicio), indiceAnioMes(previosFin));
      }

      // --- Meses proyectados: max(interInicio, primer día mes actual) .. interFin
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

      // Recorta contrato al año
      const inicio = fechaInicioContrato ? new Date(fechaInicioContrato) : inicioAnio;
      const fin    = fechaFinContrato   ? new Date(fechaFinContrato)    : finAnio;

      const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

      const interInicio = new Date(Math.max(inicio.getTime(), inicioAnio.getTime(), inicioCorte.getTime()));
      const interFin    = new Date(Math.min((fechaFinContrato ? new Date(fechaFinContrato) : finAnio).getTime(), finAnio.getTime()));
      if (interFin < interInicio) return { previosMeses: 0, proyectadosMeses: 0 };

      const ultimoDiaMesAnterior = new Date(anio, mes - 1, 0);
      const primerDiaMesActual   = new Date(anio, mes - 1, 1);

      // Previos
      const previosFin = new Date(Math.min(interFin.getTime(), ultimoDiaMesAnterior.getTime()));
      let previosMeses = 0;
      if (previosFin >= interInicio) {
        previosMeses = contarMesesEntreYM(indiceAnioMes(interInicio), indiceAnioMes(previosFin));
      }

      // Proyectados
      const projInicio = new Date(Math.max(interInicio.getTime(), primerDiaMesActual.getTime()));
      let proyectadosMeses = 0;
      if (interFin >= projInicio) {
        proyectadosMeses = contarMesesEntreYM(indiceAnioMes(projInicio), indiceAnioMes(interFin));
      }

      return { previosMeses, proyectadosMeses };
    }


    // === Gratificaciones (registro si existe; si no, PROYECCIÓN por trabajador/filial) ===
    let gratificaciones_total = 0;
    let gratiJulioTrabajador = 0;
    let gratiJulioProj = 0;
    let gratiDiciembreTrabajador = 0;
    let gratiDiciembreProj = 0;

    const filialId = filialIdPreferida || null;

    /** Normaliza cualquier respuesta del repo de grati a una fila del trabajador actual */
    const elegirFilaPorTrabajador = (respuesta) => {
      if (!respuesta) return null;

      if (respuesta.dataValues) {
        return respuesta; 
      }
      
      // Si viene con lista de trabajadores (cierre o cálculo trunco)
      const lista =
          (respuesta.planilla && Array.isArray(respuesta.planilla.trabajadores) && respuesta.planilla.trabajadores) ||
          (Array.isArray(respuesta.listaTrabajadores) && respuesta.listaTrabajadores) ||
          (Array.isArray(respuesta) && respuesta) ||
          null;
      
      if (lista) {
          const found =
            lista.find((trabajador) => Number((trabajador.dataValues?.trabajador_id ?? trabajador.trabajador_id)) === Number(trabajadorId)) ||
            lista[0];
            if (!found) {
              const err = new Error("No se encontró trabajador en lista de gratificaciones"); return err;
            }
          return found || null;
      }
    };

    /** Lee el valor GRAVADO para 5ta: prioridad del campo */
    const valorGrati = (fila) => {
      if (!fila) return 0;
      const valor = fila.dataValues ? fila.dataValues : fila;

      const num = (v) => (v == null ? null : Number(v));

      // prioridad: gravado real -> semestral bruto -> totales (si no hay lo anterior)
      return (
          num(valor.grat_despues_descuento) ??
          num(valor.gratificacion_semestral) ??
          num(valor.total_pagar || 0) ??
          num(valor.total_a_pagar) ??
          0
      );
    };

    /** Contratos vigentes del año (todas las filiales) */
    async function _contratosVigentesAnio({ trabajadorId, anio }) {
      const desde = new Date(anio, 0, 1);      // 1 Ene
      const hasta = new Date(anio, 11, 31);    // 31 Dic
      return await ContratoLaboral.findAll({
        where: {
          trabajador_id: trabajadorId,
          estado: true,
          [Op.and]: [
            { fecha_inicio: { [Op.lte]: hasta } },
            { [Op.or]: [{ fecha_fin: { [Op.gte]: desde } }, { fecha_fin: null }] }
          ]
        }
      });
    }

    /** Devuelve real/trunca/“usado” para una filial dada */
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

    if (filialId) {
      // “Reales” (si existieran)
      const gratiJulioResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gratiDiciembreResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);
      
      // Proyección “trunca”
      const gratiJulioTruncaResp = await this.gratiRepo.calcularGratificacionTruncaPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gratiDiciembreTruncaResp = await this.gratiRepo.calcularGratificacionTruncaPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);

      // Seleccionamos la fila del trabajador en cada respuesta
      const gratiJulioFilaReal = elegirFilaPorTrabajador(gratiJulioResp);
      const gratiDicFilaReal = elegirFilaPorTrabajador(gratiDiciembreResp);
      const gratiJulioFilaTrunca = elegirFilaPorTrabajador(gratiJulioTruncaResp);
      const gratiDicFilaTrunca = elegirFilaPorTrabajador(gratiDiciembreTruncaResp);

      // Extraemos valores con prioridad correcta
      const julioReal = valorGrati(gratiJulioFilaReal);
      const dicReal   = valorGrati(gratiDicFilaReal);
      const julioTrunca = valorGrati(gratiJulioFilaTrunca);
      const dicTrunca   = valorGrati(gratiDicFilaTrunca);

      // Log diagnóstico útil
      console.log("GRATI (real) JUL:", julioReal, " DIC:", dicReal);
      console.log("GRATI (trunca) JUL:", julioTrunca, " DIC:", dicTrunca);

      // Reglas por mes:
      // Ene–Jun: ambas PROYECCIÓN (trunca)
      // Jul–Nov: Julio REAL si existe, si no trunca; Diciembre PROYECCIÓN (trunca)
      // Dic: ambos REALES si existen, si no cae a trunca
      if (mes <= 6) {
          gratiJulioProj     = Number(julioTrunca || 0);
          gratiDiciembreProj = Number(dicTrunca   || 0);
          gratificaciones_total = 0;
      } else if (mes >= 7 && mes <= 11) {
          gratiJulioTrabajador = Number((julioReal && julioReal > 0 ? julioReal : julioTrunca) || 0);
          // Recorte por DJ: si aplica desde agosto, julio NO cuenta como previo
          if (aplicaDesde && aplicaDesde > 7) gratiJulioTrabajador = 0;
          gratiDiciembreProj   = Number(dicTrunca || 0);
          gratificaciones_total = gratiJulioTrabajador;
      } else {
          gratiJulioTrabajador     = Number((julioReal && julioReal > 0 ? julioReal : julioTrunca) || 0);
          if (aplicaDesde && aplicaDesde > 7) gratiJulioTrabajador = 0;
          gratiDiciembreTrabajador = Number((dicReal && dicReal > 0 ? dicReal : dicTrunca) || 0);
          gratificaciones_total = gratiJulioTrabajador + gratiDiciembreTrabajador;
      }
    }

    // === MULTI-FILIAL: gratificaciones de OTRAS filiales (proyección + pagadas) ===
    let gratiOtrasDetalle = [];
    let gratiOtrasPagadasTotal = 0;
    let gratiOtrasProjJulioTotal = 0;
    let gratiOtrasProjDicTotal   = 0;

    try {
      const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });
      
      const filialesTodas = Array.from(
        new Set(contratosTodas.map(c => Number(c.filial_id)).filter(fid => Number.isFinite(fid)))
      );
      
      // Excluye la filial actual si existe
      const filialesOtras = filialesTodas.filter(fid => !filialId || Number(fid) !== Number(filialId));

      for (const fid of filialesOtras) {
        const info = await _gratiPorFilial({
          anio, mes, filialId: fid, trabajadorId,
          gratiRepo: this.gratiRepo, elegirFilaPorTrabajador, valorGrati, aplicaDesde
        });
        gratiOtrasDetalle.push(info);

        // Agregados
        gratiOtrasPagadasTotal += Number(info.julio.usado || 0) + Number(info.diciembre.usado || 0);
        gratiOtrasProjJulioTotal += Number(info.julio.proj || 0);
        gratiOtrasProjDicTotal   += Number(info.diciembre.proj || 0);
      }

      // Redondeo amable
      gratiOtrasPagadasTotal   = Number(gratiOtrasPagadasTotal.toFixed(2));
      gratiOtrasProjJulioTotal = Number(gratiOtrasProjJulioTotal.toFixed(2));
      gratiOtrasProjDicTotal   = Number(gratiOtrasProjDicTotal.toFixed(2));
      console.log("GRATIS PAGADAS DE OTRAS FILIALES: ", gratiOtrasPagadasTotal)
      console.log("GRATIS PROYECTADAS JULIO DE OTRAS FILIALES: ", gratiOtrasProjJulioTotal)
      console.log("GRATIS PROYECTADAS DICIEMBRE DE OTRAS FILIALES: ", gratiOtrasProjDicTotal)

    } catch (e) {
      console.warn("WARN multi-filial grati:", e?.message || e);
    }

    // === MULTI-FILIAL: remuneraciones (sueldos) de OTRAS filiales ===
    let remuOtrasDetalle = [];
    let remuOtrasPreviosTotal = 0;
    let remuOtrasProjTotal = 0;

    try {
      const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });
      const filialesTodas = Array.from(
        new Set(contratosTodas.map(c => Number(c.filial_id)).filter(fid => Number.isFinite(fid)))
      );

      // EXCLUIR filial actual si la hay
      const filialesOtras = filialesTodas.filter(fid => !filialId || Number(fid) !== Number(filialId));

      for (const c of contratosTodas) {
        const fid = Number(c.filial_id);
        if (filialId && fid === Number(filialId)) continue; // omitir actual

        const { previosMeses, proyectadosMeses } = splitMesesContratoPorCorte({
          anio, mes,
          fechaInicioContrato: c.fecha_inicio,
          fechaFinContrato: c.fecha_fin,
          aplicaDesde
        });

        const sueldo = Number(c.sueldo || 0);
        const previosMonto = previosMeses * sueldo;
        const projMonto    = proyectadosMeses * sueldo;

        remuOtrasDetalle.push({
          filial_id: fid,
          contrato_id: Number(c.id),
          sueldo,
          previos_meses: previosMeses,
          previos_monto: Number(previosMonto.toFixed(2)),
          proj_meses: proyectadosMeses,
          proj_monto: Number(projMonto.toFixed(2)),
        });

        remuOtrasPreviosTotal += previosMonto;
        remuOtrasProjTotal += projMonto;
      }

      remuOtrasPreviosTotal = Number(remuOtrasPreviosTotal.toFixed(2));
      remuOtrasProjTotal = Number(remuOtrasProjTotal.toFixed(2));
    } catch (e) {
      console.warn("WARN multi-filial remuneraciones:", e?.message || e);
    }

    // Fechas
    const primerDiaDelMesActual = new Date(anio, mes - 1, 1);
    const ultimoDiaMesAnterior  = new Date(anio, mes - 1, 0);
    const ultimoDiaMesActual    = new Date(anio, mes, 0);

    // Bonos acumulados hasta el mes anterior
    const inicioPreviosBonos = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : new Date(anio, 0, 1);
    let bonos = 0;
    if (mes > 1) {
      bonos = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
        trabajadorId, ymd(inicioPreviosBonos), ymd(ultimoDiaMesAnterior)
      );
      console.log("BONOS DEL MES ANTERIOR: ", bonos)
    }

    // Bonos del mes actual
    const bonosDelMes = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
      trabajadorId, ymd(primerDiaDelMesActual), ymd(ultimoDiaMesActual)
    );
    console.log("BONOS DEL MES ACTUAL: ", bonosDelMes)

    // Parámetros (valor hora extra)
    const parametros = await getParametrosTributarios();
    const { valorHoraExtra, valorAsignacionFamiliar } = confirmarParametrosTributarios(parametros);

    // Horas extras del mes (se pagan al valor/hora)
    const horasExtrasDelMes = await this.asistenciaRepo.obtenerHorasExtrasPorRangoFecha(
      trabajadorId, ymd(primerDiaDelMesActual), ymd(ultimoDiaMesActual)
    );
    console.log("HORAS EXTRAS DEL MES: ", horasExtrasDelMes)

    // --- ASIGNACIÓN FAMILIAR (previos + proyección) ---

    // Traemos todos los contratos del año
    const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });

    // Ubicamos el contrato actual (si hay filial seleccionada)
    const contratoActual = filialId
      ? contratosTodas.find(c => Number(c.filial_id) === Number(filialId))
      : null;

    // Fecha AF desde (si viene string => DATE)
    const AF_DESDE = asignacion_familiar_desde ? new Date(asignacion_familiar_desde) : null;
  
    // Calculamos AF para la filial actual
    let afPreviosActual = 0;
    let afProjActual = 0;

    if (contratoActual && AF_DESDE) {
      const { previosMeses, proyectadosMeses } = calcularMesesAFPorContratoEnAnio({
        anio,
        mes,
        afDesde: AF_DESDE,
        fechaInicioContrato: contratoActual.fecha_inicio,
        fechaFinContrato: contratoActual.fecha_fin,
        aplicaDesde
      });
      console.log("MESES PREVIOS: ", previosMeses)
      console.log("MESES PROJ: ", proyectadosMeses)

      afPreviosActual = previosMeses * Number(valorAsignacionFamiliar || 0);
      afProjActual = proyectadosMeses * Number(valorAsignacionFamiliar || 0);
      console.log("ASIGNACION FAMILIAR PREVIOS ACTUAL: ", afPreviosActual)
      console.log("ASIGNACION FAMILIAR PROJ ACTUAL: ", afProjActual)
    }

    // Calculamos AF para otras filiales (multi)
    let afOtrasDetalle = [];
    let afOtrasPreviosTotal = 0;
    let afOtrasProjTotal = 0;

    if (AF_DESDE && Array.isArray(contratosTodas)) {
      for (const c of contratosTodas) {
        const fid = Number(c.filial_id);
        // excluímos la filial actual si existe
        if (filialId && fid === Number(filialId)) continue;

        const { previosMeses, proyectadosMeses } = calcularMesesAFPorContratoEnAnio({
          anio,
          mes,
          afDesde: AF_DESDE,
          fechaInicioContrato: c.fecha_inicio,
          fechaFinContrato: c.fecha_fin,
          aplicaDesde
        });

        const previos = previosMeses * Number(valorAsignacionFamiliar || 0);
        const proj = proyectadosMeses * Number(valorAsignacionFamiliar || 0);

        afOtrasDetalle.push({
          filial_id: fid,
          previos_meses: previosMeses,
          previos_monto: Number(previos.toFixed(2)),
          proj_meses: proyectadosMeses,
          proj_monto: Number(proj.toFixed(2))
        });
        console.log("ASIGNACION FAMILIAR DETALLES OTROS:", afOtrasDetalle)
        afOtrasPreviosTotal += previos;
        afOtrasProjTotal += proj;
      }

      afOtrasPreviosTotal = Number(afOtrasPreviosTotal.toFixed(2));
      afOtrasProjTotal = Number(afOtrasProjTotal.toFixed(2));
    }
    
    // === Construcción del resultado según FUENTE ===
    let resultado;
    if (fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS) {
      resultado = {
        remuneraciones: 0,
        gratificaciones: 0,
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        bonos: 0,
        extraGravadoMes: Number((bonosDelMes || 0) + (horasExtrasDelMes * valorHoraExtra || 0)),
        asignacion_familiar: 0,
        es_proyeccion: false,
        total_ingresos: 0,
      };
    } else if (fuentePrevios === FUENTE_PREVIOS.CERTIFICADO && certificadoQuinta) {
      const rentaBruta = Number(certificadoQuinta.renta_bruta_total || 0);
      resultado = {
        remuneraciones: Number(certificadoQuinta.remuneraciones || 0),
        gratificaciones: Number(certificadoQuinta.gratificaciones || 0),
        bonos: Number(certificadoQuinta.otros || 0),
        asignacion_familiar: Number(certificadoQuinta.asignacion_familiar || 0),
        total_ingresos: rentaBruta > 0
          ? rentaBruta
          : (Number(certificadoQuinta.remuneraciones || 0) +
             Number(certificadoQuinta.gratificaciones || 0) +
             Number(certificadoQuinta.otros || 0) +
             Number(certificadoQuinta.asignacion_familiar || 0)),
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        extraGravadoMes: Number((bonosDelMes || 0) + (horasExtrasDelMes * valorHoraExtra || 0)),
        es_proyeccion: false,
      };
    } else {
      // AUTO con recorte por DJ
      const mesesPreviosDesdeCorte = (() => {
        const prev = (mes - 1);
        if (!aplicaDesde) return prev;
        return Math.max(0, prev - (aplicaDesde - 1)); // m-1 - (aplica-1) = m - aplica
      })();

      const remuneracionesPrevias = Number(sueldoBase) * mesesPreviosDesdeCorte;

      // AF (previos reales) + proyección del resto del año
      const asignacion_familiar = Number(afPreviosActual || 0);
      const asignacion_familiar_proj = Number(afProjActual || 0);

      resultado = {
        remuneraciones: remuneracionesPrevias,
        gratificaciones: Number(parseFloat(gratificaciones_total).toFixed(2)),
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        bonos: Number(bonos || 0),
        extraGravadoMes: Number((bonosDelMes || 0) + ((horasExtrasDelMes * valorHoraExtra) || 0)),
        asignacion_familiar,
        asignacion_familiar_proj,
        es_proyeccion: true,
        remu_multi: {
          detalle_por_filial: remuOtrasDetalle,
          previos_total_otras: Number(remuOtrasPreviosTotal || 0),
          proyeccion_total_otras: Number(remuOtrasProjTotal || 0),
        },
        grati_multi: {
          detalle_por_filial: gratiOtrasDetalle,         
          pagadas_total_otras: Number(gratiOtrasPagadasTotal || 0),
          proyeccion_total_otras: {
            julio: Number(gratiOtrasProjJulioTotal || 0),
            diciembre: Number(gratiOtrasProjDicTotal || 0)
          }
        },
        af_multi: {
          detalle_por_filial: afOtrasDetalle,
          previos_total_otras: Number(afOtrasPreviosTotal || 0),
          proyeccion_total_otras: Number(afOtrasProjTotal || 0)
        }
      };
      resultado.total_ingresos =
        resultado.remuneraciones +
        resultado.gratificaciones +
        resultado.bonos +
        resultado.asignacion_familiar;
    }

    return resultado;
  }

  async _getRetencionesPrevias({ trabajadorId, anio, mes }) {
        const historicos = await this.quintaRepo.findByWorkerYear({ trabajadorId, anio });
  
        if (!Array.isArray(historicos) || historicos.length === 0) return 0;

        // Elegimos el "vigente" por mes: el último creado
        const vigentePorMes = new Map(); 
        const mesObj = Number(mes);

        for (const retencion of historicos) {
            const mes = Number(retencion.mes);
            if (!Number.isFinite(mes) || !(mes < mesObj)) continue;

            const prev = vigentePorMes.get(mes);
            
            if (!prev) {
                vigentePorMes.set(mes, retencion);
                continue;
            }

            const dPrev = new Date(prev.createdAt || 0).getTime();
            const dCur = new Date(retencion.createdAt || 0).getTime();

            // Si el nuevo es más reciente, reemplazamos
            if (dCur > dPrev || (!dPrev && Number(retencion.id) > Number(prev.id))) {
                vigentePorMes.set(mes, retencion);
            }
        }

        let total = 0;
        for (const retencion of vigentePorMes.values()) {
          
            total += Number(retencion.retencion_base_mes || 0) + Number(retencion.retencion_adicional_mes || 0);
        }
        
        return Number(total.toFixed(2));
    }
}

module.exports = ObtenerIngresosPrevios;