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

    // NUEVO: mes desde el cual la DJ "Sin Previos" indica que se ignoran previos anteriores
    sinPreviosAplicaDesde,
  }) {
    console.log("TRABAJADOR ID EN OBTENER INGRESOS PREV: ", trabajadorId)
    console.log("DNI EN OBTENER INGRESOS PREV: ", dni)
    console.log("AÑO  EN OBTENER INGRESOS PREV: ", anio)
    console.log("MES EN OBTENER INGRESOS PREV: ", mes)
    console.log("REMUNERACION MENSUAL ACTUAL EN OBTENER INGRESOS PREV: ", remuneracionMensualActual)
    console.log("FUENTE PREVIOS EN OBTENER INGRESOS PREV: ", fuentePrevios)
    console.log("CERTIFICADO QUINTA ID EN OBTENER INGRESOS PREV: ", certificadoQuinta)
    console.log("FILIAL ID PREFERIDA EN OBTENER INGRESOS PREV: \n", filialIdPreferida)
    console.log("CONTRATO ID EN OBTENER INGRESOS PREV: ", contratoId)
    console.log("TIENE ASIGNACION FAMILIAR EN OBTENER INGRESOS PREV: ", asignacion_familiar, "DESDE :", asignacion_familiar_desde)

    const sueldoBase = Number(remuneracionMensualActual ?? 0);
    const aplicaDesde = Number(sinPreviosAplicaDesde || 0) || null;

    const pad2 = (n) => String(n).padStart(2, "0");
    const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

    // Helpers de fechas
    const indiceAnioMes = (fecha) => {
      if (!fecha) return null;
      const d = (fecha instanceof Date) ? fecha : new Date(fecha);
      if (isNaN(d)) return null;
      return d.getFullYear() * 12 + d.getMonth(); // 0 = Enero
    };
    const limitarFechaARango = (fecha, min, max) => {
      const x = new Date(fecha);
      if (x < min) return new Date(min);
      if (x > max) return new Date(max);
      return x;
    };
    const contarMesesEntreYM = (desdeYM, hastaYM) => {
      if (desdeYM == null || hastaYM == null) return 0;
      if (hastaYM < desdeYM) return 0;
      return (hastaYM - desdeYM + 1);
    };

    // AF por contrato con recorte al corte (aplicaDesde)
    function calcularMesesAFPorContratoEnAnio({
      anio, mes, afDesde, fechaInicioContrato, fechaFinContrato, aplicaDesde
    }) {
      const inicioAnio = new Date(anio, 0, 1);
      const finAnio    = new Date(anio, 11, 31);

      if (!afDesde) return { previosMeses: 0, proyectadosMeses: 0 };

      const inicioAF = limitarFechaARango(afDesde, inicioAnio, finAnio);
      const inicioContrato = fechaInicioContrato
        ? limitarFechaARango(fechaInicioContrato, inicioAnio, finAnio)
        : inicioAnio;
      const finContrato = fechaFinContrato
        ? limitarFechaARango(fechaFinContrato, inicioAnio, finAnio)
        : finAnio;

      const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

      const interInicio = new Date(Math.max(
        inicioAF.getTime(), inicioContrato.getTime(), inicioAnio.getTime(), inicioCorte.getTime()
      ));
      const interFin = new Date(Math.min(finContrato.getTime(), finAnio.getTime()));
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

    // Remuneraciones por contrato con recorte al corte
    function splitMesesContratoPorCorte({ anio, mes, fechaInicioContrato, fechaFinContrato, aplicaDesde }) {
      const inicioAnio = new Date(anio, 0, 1);
      const finAnio    = new Date(anio, 11, 31);

      const inicio = fechaInicioContrato ? new Date(fechaInicioContrato) : inicioAnio;
      const fin    = fechaFinContrato   ? new Date(fechaFinContrato)    : finAnio;

      const inicioCorte = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : inicioAnio;

      const interInicio = new Date(Math.max(inicio.getTime(), inicioAnio.getTime(), inicioCorte.getTime()));
      const interFin    = new Date(Math.min((fechaFinContrato ? new Date(fechaFinContrato) : finAnio).getTime(), finAnio.getTime()));
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

    // ========= Gratificaciones (actual y multi), respetando corte =========
    let gratificaciones_total = 0;
    let gratiJulioTrabajador = 0;
    let gratiJulioProj = 0;
    let gratiDiciembreTrabajador = 0;
    let gratiDiciembreProj = 0;

    const filialId = filialIdPreferida || null;

    const elegirFilaPorTrabajador = (respuesta) => {
      if (!respuesta) return null;
      if (respuesta.dataValues) return respuesta;

      const lista =
        (respuesta.planilla && Array.isArray(respuesta.planilla.trabajadores) && respuesta.planilla.trabajadores) ||
        (Array.isArray(respuesta.listaTrabajadores) && respuesta.listaTrabajadores) ||
        (Array.isArray(respuesta) && respuesta) ||
        null;

      if (lista) {
        const found =
          lista.find((t) => Number((t.dataValues?.trabajador_id ?? t.trabajador_id)) === Number(trabajadorId)) ||
          lista[0];
        return found || null;
      }
    };
    const valorGrati = (fila) => {
      if (!fila) return 0;
      const v = (fila.dataValues ? fila.dataValues : fila);
      const n = (x) => (x == null ? null : Number(x));
      return (
        n(v.grat_despues_descuento) ??
        n(v.gratificacion_semestral) ??
        n(v.total_pagar || 0) ??
        n(v.total_a_pagar) ??
        0
      );
    };

    async function _contratosVigentesAnio({ trabajadorId, anio }) {
      const desde = new Date(anio, 0, 1);
      const hasta = new Date(anio, 11, 31);
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

    async function _gratiPorFilial({ anio, mes, filialId, trabajadorId, gratiRepo, elegirFilaPorTrabajador, valorGrati, aplicaDesde }) {
      const gJRealResp = await gratiRepo.obtenerGratificacionPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gDRealResp = await gratiRepo.obtenerGratificacionPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);
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

      let usadoJulio = 0, usadoDiciembre = 0, julioProj = 0, dicProj = 0;
      if (mes <= 6) {
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
      const gratiJulioResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gratiDiciembreResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);
      const gratiJulioTruncaResp = await this.gratiRepo.calcularGratificacionTruncaPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gratiDiciembreTruncaResp = await this.gratiRepo.calcularGratificacionTruncaPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);

      const gratiJulioFilaReal = elegirFilaPorTrabajador(gratiJulioResp);
      const gratiDicFilaReal = elegirFilaPorTrabajador(gratiDiciembreResp);
      const gratiJulioFilaTrunca = elegirFilaPorTrabajador(gratiJulioTruncaResp);
      const gratiDicFilaTrunca = elegirFilaPorTrabajador(gratiDiciembreTruncaResp);

      const julioReal   = valorGrati(gratiJulioFilaReal);
      const dicReal     = valorGrati(gratiDicFilaReal);
      const julioTrunca = valorGrati(gratiJulioFilaTrunca);
      const dicTrunca   = valorGrati(gratiDicFilaTrunca);

      console.log("GRATI (real) JUL:", julioReal, " DIC:", dicReal);
      console.log("GRATI (trunca) JUL:", julioTrunca, " DIC:", dicTrunca);

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
        gratiDiciembreTrabajador = Number((dicReal   && dicReal   > 0 ? dicReal  : dicTrunca)   || 0);
        gratificaciones_total = gratiJulioTrabajador + gratiDiciembreTrabajador;
      }
    }

    // === MULTI-FILIAL – gratificaciones de otras filiales respetando corte ===
    let gratiOtrasDetalle = [];
    let gratiOtrasPagadasTotal = 0;
    let gratiOtrasProjJulioTotal = 0;
    let gratiOtrasProjDicTotal   = 0;

    try {
      const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });
      const filialesTodas = Array.from(new Set(contratosTodas.map(c => Number(c.filial_id)).filter(Number.isFinite)));
      const filialesOtras = filialesTodas.filter(fid => !filialId || Number(fid) !== Number(filialId));

      for (const fid of filialesOtras) {
        const info = await _gratiPorFilial({
          anio, mes, filialId: fid, trabajadorId,
          gratiRepo: this.gratiRepo, elegirFilaPorTrabajador, valorGrati, aplicaDesde
        });
        gratiOtrasDetalle.push(info);

        gratiOtrasPagadasTotal   += Number(info.julio.usado || 0) + Number(info.diciembre.usado || 0);
        gratiOtrasProjJulioTotal += Number(info.julio.proj || 0);
        gratiOtrasProjDicTotal   += Number(info.diciembre.proj || 0);
      }

      gratiOtrasPagadasTotal   = Number(gratiOtrasPagadasTotal.toFixed(2));
      gratiOtrasProjJulioTotal = Number(gratiOtrasProjJulioTotal.toFixed(2));
      gratiOtrasProjDicTotal   = Number(gratiOtrasProjDicTotal.toFixed(2));
      console.log("GRATIS PAGADAS DE OTRAS FILIALES: ", gratiOtrasPagadasTotal)
      console.log("GRATIS PROYECTADAS JULIO DE OTRAS FILIALES: ", gratiOtrasProjJulioTotal)
      console.log("GRATIS PROYECTADAS DICIEMBRE DE OTRAS FILIALES: ", gratiOtrasProjDicTotal)
    } catch (e) {
      console.warn("WARN multi-filial grati:", e?.message || e);
    }

    // === MULTI-FILIAL – remuneraciones de otras filiales respetando corte ===
    let remuOtrasDetalle = [];
    let remuOtrasPreviosTotal = 0;
    let remuOtrasProjTotal = 0;

    try {
      const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });
      const filialesTodas = Array.from(new Set(contratosTodas.map(c => Number(c.filial_id)).filter(Number.isFinite)));
      const filialesOtras = filialesTodas.filter(fid => !filialId || Number(fid) !== Number(filialId));

      for (const c of contratosTodas) {
        const fid = Number(c.filial_id);
        if (filialId && fid === Number(filialId)) continue;

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

    // Fechas del mes en curso
    const primerDiaDelMesActual = new Date(anio, mes - 1, 1);
    const ultimoDiaMesAnterior  = new Date(anio, mes - 1, 0);
    const ultimoDiaMesActual    = new Date(anio, mes, 0);

    // Bonos acumulados hasta el mes anterior (recortando por corte)
    const inicioPreviosBonos = aplicaDesde ? new Date(anio, aplicaDesde - 1, 1) : new Date(anio, 0, 1);
    let bonos = 0;
    if (mes > 1) {
      bonos = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
        trabajadorId, ymd(inicioPreviosBonos), ymd(ultimoDiaMesAnterior)
      );
      console.log("BONOS DEL PERIODO PREVIO (recortado): ", bonos)
    }

    // Bonos del mes actual
    const bonosDelMes = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
      trabajadorId, ymd(primerDiaDelMesActual), ymd(ultimoDiaMesActual)
    );
    console.log("BONOS DEL MES ACTUAL: ", bonosDelMes)

    // Parámetros y horas extra (mes actual)
    const parametros = await getParametrosTributarios();
    const { valorHoraExtra, valorAsignacionFamiliar } = confirmarParametrosTributarios(parametros);
    const horasExtrasDelMes = await this.asistenciaRepo.obtenerHorasExtrasPorRangoFecha(
      trabajadorId, ymd(primerDiaDelMesActual), ymd(ultimoDiaMesActual)
    );
    console.log("HORAS EXTRAS DEL MES: ", horasExtrasDelMes)

    // Contratos del año
    const contratosTodas = await _contratosVigentesAnio({ trabajadorId, anio });
    const contratoActual = filialId
      ? contratosTodas.find(c => Number(c.filial_id) === Number(filialId))
      : null;

    // AF previa/proyección (respeta corte)
    const AF_DESDE = asignacion_familiar_desde ? new Date(asignacion_familiar_desde) : null;
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
      console.log("MESES PREVIOS (AF) recortado: ", previosMeses)
      console.log("MESES PROJ (AF): ", proyectadosMeses)

      afPreviosActual = previosMeses * Number(valorAsignacionFamiliar || 0);
      afProjActual = proyectadosMeses * Number(valorAsignacionFamiliar || 0);
    }

    // AF Multi
    let afOtrasDetalle = [];
    let afOtrasPreviosTotal = 0;
    let afOtrasProjTotal = 0;

    if (AF_DESDE && Array.isArray(contratosTodas)) {
      for (const c of contratosTodas) {
        const fid = Number(c.filial_id);
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

        afOtrasPreviosTotal += previos;
        afOtrasProjTotal += proj;
      }

      afOtrasPreviosTotal = Number(afOtrasPreviosTotal.toFixed(2));
      afOtrasProjTotal = Number(afOtrasProjTotal.toFixed(2));
    }

    // === Construcción según FUENTE ===
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

      // AF (previos recortados) + proyección del resto del año
      const asignacion_familiar_prev = Number(afPreviosActual || 0);
      const asignacion_familiar_proj = Number(afProjActual || 0);

      // Grati julio pagada se excluye si el corte es >= agosto (ya ajustada arriba)
      const gratiPrevTotal = Number(parseFloat(
        (gratiJulioTrabajador || 0) + (gratiDiciembreTrabajador || 0)
      ).toFixed(2));

      resultado = {
        remuneraciones: remuneracionesPrevias,
        gratificaciones: gratiPrevTotal,
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        bonos: Number(bonos || 0),
        extraGravadoMes: Number((bonosDelMes || 0) + ((horasExtrasDelMes * valorHoraExtra) || 0)),
        asignacion_familiar: asignacion_familiar_prev,
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

    const vigentePorMes = new Map();
    const mesObj = Number(mes);

    for (const retencion of historicos) {
      const m = Number(retencion.mes);
      if (!Number.isFinite(m) || !(m < mesObj)) continue;

      const prev = vigentePorMes.get(m);
      if (!prev) { vigentePorMes.set(m, retencion); continue; }

      const dPrev = new Date(prev.createdAt || 0).getTime();
      const dCur = new Date(retencion.createdAt || 0).getTime();
      if (dCur > dPrev || (!dPrev && Number(retencion.id) > Number(prev.id))) {
        vigentePorMes.set(m, retencion);
      }
    }

    let total = 0;
    for (const r of vigentePorMes.values()) {
      total += Number(r.retencion_base_mes || 0) + Number(r.retencion_adicional_mes || 0);
    }
    return Number(total.toFixed(2));
  }
}

module.exports = ObtenerIngresosPrevios;