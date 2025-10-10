const { Op } = require("sequelize");
const { FUENTE_PREVIOS } = require('../../shared/constants/tributario/quinta');
const { getParametrosTributarios } = require('../../shared/utils/tax/calculadorQuinta');
const { confirmarParametrosTributarios } = require('../../shared/utils/helpers')
const { ContratoLaboral } = require("../../../contratos_laborales/infraestructure/models/contratoLaboralModel");
const { ymd } = require('../../shared/utils/helpers');

const { 
  calcularMesesAFPorContratoEnAnio, 
  splitMesesContratoPorCorte,
  valorGrati,
  _gratiPorFilial,
  elegirFilaPorTrabajador,
} = require('../../shared/utils/obtenerIngresosPreviosHelpers');

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

  /** Trae todos los contratos del año (cualquier filial), sólo vigentes en el año */
  async _contratosVigentesAnio({ trabajadorId, anio }) {
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

  _toNum(v, def= 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  }

  _otrasFilialesIds(contratos, filialActualId) {
    const all = Array.from(
      new Set(
        (Array.isArray(contratos) ? contratos : [])
        .map((c) => Number(c.filial_id))
        .filter((fid) => Number.isFinite(fid))
      )
    );
    return filialActualId == null
      ? all
      : all.filter((fid) => Number(fid) !== Number(filialActualId));
  }

  async execute({
    trabajadorId,
    dni,                       
    anio, 
    mes,
    remuneracionMensualActual,
    fuentePrevios,
    certificadoQuinta,
    filialIdPreferida,         
    contratoId,
    asignacion_familiar,  
    asignacion_familiar_desde, 
    sinPreviosAplicaDesde,             
  }) {

    const sueldoBase = Number(remuneracionMensualActual ?? 0);
    const aplicaDesde = Number(sinPreviosAplicaDesde || 0) || null;
    const filialId = filialIdPreferida || null;

    // Fechas base
    const primerDiaDelMesActual = new Date(anio, mes - 1, 1);
    const ultimoDiaMesAnterior  = new Date(anio, mes - 1, 0);
    const ultimoDiaMesActual    = new Date(anio, mes, 0);

    const contratosTodas = await this._contratosVigentesAnio({ trabajadorId, anio });
    const contratoActual = filialId
      ? contratosTodas.find((c) => Number(c.filial_id) === Number(filialId))
      : null;
    const otrasFiliales = this._otrasFilialesIds(contratosTodas, filialId);

    // === Gratificaciones (filial actual) ===
    let gratificaciones_total = 0;
    let gratiJulioTrabajador = 0;
    let gratiJulioProj = 0;
    let gratiDiciembreTrabajador = 0;
    let gratiDiciembreProj = 0;


    if (filialId) {
      // “Reales” y Proyección “trunca”
      const gratiJulioResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("JULIO", anio, filialId, trabajadorId);
      const gratiDiciembreResp = await this.gratiRepo.obtenerGratificacionPorTrabajador("DICIEMBRE", anio, filialId, trabajadorId);
      
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

    // === MULTI-FILIAL: gratificaciones de OTRAS filiales ===
    let gratiOtrasDetalle = [];
    let gratiOtrasPagadasTotal = 0;
    let gratiOtrasProjJulioTotal = 0;
    let gratiOtrasProjDicTotal   = 0;

    for (const fid of otrasFiliales) {
      try {
        const info = await _gratiPorFilial({
          anio,
          mes,
          filialId: fid,
          trabajadorId,
          gratiRepo: this.gratiRepo,
          elegirFilaPorTrabajador: (r) => elegirFilaPorTrabajador(r, trabajadorId),
          valorGrati,
          aplicaDesde,
        });
        gratiOtrasDetalle.push(info);
        gratiOtrasPagadasTotal += this._toNum(info?.julio?.usado) + this._toNum(info?.diciembre?.usado);
        gratiOtrasProjJulioTotal += this._toNum(info?.julio?.proj);
        gratiOtrasProjDicTotal += this._toNum(info?.diciembre?.proj);
      } catch (e) {
        console.warn("WARN multi-filial grati: ", e?.message || e);
      }
    }

    gratiOtrasPagadasTotal   = Number(gratiOtrasPagadasTotal.toFixed(2));
    gratiOtrasProjJulioTotal = Number(gratiOtrasProjJulioTotal.toFixed(2));
    gratiOtrasProjDicTotal   = Number(gratiOtrasProjDicTotal.toFixed(2));

    // INNOVA PRO+ v1.1.1 — Split consistente previos/mes-actual/proyección por contrato (otras filiales)
    const _firstDay = (y, m) => new Date(y, m - 1, 1);
    const _lastDay  = (y, m) => new Date(y, m, 0);
    const _clampToYear = (d, y) => {
      const min = new Date(y, 0, 1);
      const max = new Date(y, 11, 31);
      return new Date(Math.min(Math.max(d.getTime(), min.getTime()), max.getTime()));
    };
    const _month = (d) => d.getMonth() + 1; // 1..12
    const _countMonthsInclusive = (mStart, mEnd) => Math.max(0, (mEnd - mStart + 1));

    // === MULTI-FILIAL: remuneraciones (sueldos) de OTRAS filiales ===
    let remuOtrasDetalle = [];
    let remuOtrasPreviosTotal = 0;
    let remuOtrasProjTotal = 0;
    let remuOtrasMesActualTotal = 0;

    /* for (const c of contratosTodas) {
      const fid = Number(c.filial_id);
      if (filialId && fid === Number(filialId)) continue; // Para omitir la actual

      try {
        const { previosMeses, proyectadosMeses } = splitMesesContratoPorCorte({
          anio,
          mes,
          fechaInicioContrato: c.fecha_inicio,
          fechaFinContrato: c.fecha_fin,
          aplicaDesde,
        });
        
        const sueldo = this._toNum(c.sueldo);
        
        const fIni = new Date(c.fecha_inicio);
        const fFin = c.fecha_fin ? new Date(c.fecha_fin) : null;

        // ¿Contrato vigente en el mes actual?
        const vigenteMesActual =
          fIni <= ultimoDiaMesActual && (fFin === null || fFin >= primerDiaDelMesActual);

        const projMesesSinMesActual = vigenteMesActual
          ? Math.max((proyectadosMeses || 0) - 1, 0)
          : (proyectadosMeses || 0);

        const previosMonto = (previosMeses || 0) * sueldo;
        const projMontoSinMesActual = projMesesSinMesActual * sueldo;
        const mesActualMonto = vigenteMesActual ? sueldo : 0;

        remuOtrasDetalle.push({
          filial_id: fid,
          contrato_id: Number(c.id),
          sueldo,
          previos_meses: previosMeses || 0,
          previos_monto: Number(previosMonto.toFixed(2)),
          proj_meses: projMesesSinMesActual,
          proj_monto: Number(projMontoSinMesActual.toFixed(2)),
          mes_actual_monto: Number(mesActualMonto.toFixed(2)),
        });

        remuOtrasPreviosTotal += previosMonto;
        remuOtrasProjTotal += projMontoSinMesActual;

        remuOtrasMesActualTotal = (remuOtrasMesActualTotal || 0) + mesActualMonto;
      } catch (e) {
        console.warn("WARN multi-filial remuneraciones: ", e?.message || e);
      }
    }
    remuOtrasPreviosTotal = Number(remuOtrasPreviosTotal.toFixed(2));
    remuOtrasProjTotal = Number(remuOtrasProjTotal.toFixed(2)); */

    for (const c of contratosTodas) {
      const fid = Number(c.filial_id);
      if (filialId && fid === Number(filialId)) continue; // omitir filial actual

      const sueldo = this._toNum(c.sueldo);

      // Fechas del contrato B acotadas al año
      const fIni = _clampToYear(new Date(c.fecha_inicio), anio);
      const fFin = c.fecha_fin ? _clampToYear(new Date(c.fecha_fin), anio) : new Date(anio, 11, 31);
      const iniM = _month(fIni);
      const finM = _month(fFin);

      // Estado del mes actual
      const vigenteMesActual = (mes >= iniM && mes <= finM);

      // 1) PREVIOS: [iniM .. min(finM, mes-1)]
      const prevStart = iniM;
      const prevEnd   = Math.min(finM, mes - 1);
      const previosMeses = _countMonthsInclusive(prevStart, prevEnd);
      const previosMonto = Number((previosMeses * sueldo).toFixed(2));

      // 2) MES ACTUAL: sueldo si vigente
      const mesActualMonto = vigenteMesActual ? sueldo : 0;

      // 3) PROYECCIÓN: [max(iniM, mes+1) .. finM]
      const projStart = Math.max(iniM, mes + 1);
      const projEnd   = finM;
      const proyectadosMeses = _countMonthsInclusive(projStart, projEnd);
      const projMonto = Number((proyectadosMeses * sueldo).toFixed(2));

      remuOtrasDetalle.push({
        filial_id: fid,
        contrato_id: Number(c.id),
        sueldo,
        previos_meses: previosMeses,
        previos_monto: previosMonto,
        proj_meses: proyectadosMeses,
        proj_monto: projMonto,
        mes_actual_monto: Number(mesActualMonto.toFixed(2)),
      });

      remuOtrasPreviosTotal     += previosMonto;
      remuOtrasProjTotal        += projMonto;
      remuOtrasMesActualTotal   += mesActualMonto;
    }

    remuOtrasPreviosTotal   = Number(remuOtrasPreviosTotal.toFixed(2));
    remuOtrasProjTotal      = Number(remuOtrasProjTotal.toFixed(2));
    remuOtrasMesActualTotal = Number(remuOtrasMesActualTotal.toFixed(2));


    // === BONOS / HORAS EXTRAS ======
    const inicioPreviosBonos = aplicaDesde 
      ? new Date(anio, aplicaDesde - 1, 1) 
      : new Date(anio, 0, 1);

    // Acumulado hasta mes anterior (siempre)
    const bonosPrevios = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
      trabajadorId,
      ymd(inicioPreviosBonos),
      ymd(ultimoDiaMesAnterior)
    );

    // Solo los del mes actual
    const bonosDelMes = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
      trabajadorId,
      ymd(primerDiaDelMesActual),
      ymd(ultimoDiaMesActual)
    );

    // Total histórico a la fecha del cálculo
    const bonos = Number(bonosPrevios || 0) + Number(bonosDelMes || 0);

    const parametros = await getParametrosTributarios();
    const { valorHoraExtra, valorAsignacionFamiliar } = confirmarParametrosTributarios(parametros);

    const horasExtrasDelMes = await this.asistenciaRepo.obtenerHorasExtrasPorRangoFecha(
      trabajadorId, ymd(primerDiaDelMesActual), ymd(ultimoDiaMesActual)
    );

    // --- ASIGNACIÓN FAMILIAR (previos + proyección) ---
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
      afPreviosActual = previosMeses * Number(valorAsignacionFamiliar || 0);
      afProjActual = proyectadosMeses * Number(valorAsignacionFamiliar || 0);
    }

    // Calculamos AF para otras filiales (multi)
    let afOtrasDetalle = [];
    let afOtrasPreviosTotal = 0;
    let afOtrasProjTotal = 0;

    if (AF_DESDE) {
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
    
    // === Construcción del resultado según FUENTE ===
    let resultado;
    const extraGravadoMes = Number(
      this._toNum(bonosDelMes) + this._toNum(horasExtrasDelMes) * this._toNum(valorHoraExtra)
    );

    if (fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS) {
      resultado = {
        remuneraciones: 0,
        gratificaciones: 0,
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        bonos: 0,
        extraGravadoMes,
        asignacion_familiar: 0,
        es_proyeccion: false,
        total_ingresos: 0,
      };
    } else if (fuentePrevios === FUENTE_PREVIOS.CERTIFICADO && certificadoQuinta) {
      const rentaBruta = this._toNum(certificadoQuinta.renta_bruta_total);
      const remuCert = this._toNum(certificadoQuinta.remuneraciones);
      const gratiCert = this._toNum(certificadoQuinta.gratificaciones);
      const otrosCert = this._toNum(certificadoQuinta.otros);
      const afCert = this._toNum(certificadoQuinta.asignacion_familiar);

      resultado = {
        remuneraciones: remuCert,
        gratificaciones: gratiCert,
        bonos: otrosCert,
        asignacion_familiar: afCert,
        total_ingresos: 
          rentaBruta > 0 ? rentaBruta : remuCert + gratiCert + otrosCert + afCert,
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        extraGravadoMes,
        es_proyeccion: false,
      };
    } else {
      // AUTO con recorte por DJ
      const mesesPreviosDesdeCorte = (() => {
        const prev = (mes - 1);
        if (!aplicaDesde) return prev;
        return Math.max(0, prev - (aplicaDesde - 1)); 
      })();

      const remuneracionesPrevias = this._toNum(sueldoBase) * mesesPreviosDesdeCorte;

      const asignacion_familiar_prev = this._toNum(afPreviosActual);
      const asignacion_familiar_proj = this._toNum(afProjActual);

      resultado = {
        remuneraciones: remuneracionesPrevias,
        gratificaciones: Number(this._toNum(gratificaciones_total).toFixed(2)),
        gratiJulioTrabajador,
        gratiJulioProj,
        gratiDiciembreTrabajador,
        gratiDiciembreProj,
        bonos: this._toNum(bonos),
        extraGravadoMes,
        asignacion_familiar: asignacion_familiar_prev,
        asignacion_familiar_proj,
        es_proyeccion: true,
        /* remu_multi: {
          detalle_por_filial: remuOtrasDetalle,
          previos_total_otras: this._toNum(remuOtrasPreviosTotal),
          proyeccion_total_otras: this._toNum(remuOtrasProjTotal),
          mes_actual_otras: Number((remuOtrasMesActualTotal || 0).toFixed(2)),
        }, */
        remu_multi: {
          detalle_por_filial: remuOtrasDetalle,
          previos_total_otras: remuOtrasPreviosTotal,
          proyeccion_total_otras: remuOtrasProjTotal,
          mes_actual_otras: remuOtrasMesActualTotal, 
        },
        grati_multi: {
          detalle_por_filial: gratiOtrasDetalle,         
          pagadas_total_otras: this._toNum(gratiOtrasPagadasTotal),
          proyeccion_total_otras: {
            julio: this._toNum(gratiOtrasProjJulioTotal),
            diciembre: this._toNum(gratiOtrasProjDicTotal)
          }
        },
        af_multi: {
          detalle_por_filial: afOtrasDetalle,
          previos_total_otras: this._toNum(afOtrasPreviosTotal),
          proyeccion_total_otras: this._toNum(afOtrasProjTotal)
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

            if (dCur > dPrev || (!dPrev && Number(retencion.id) > Number(prev.id))) {
                vigentePorMes.set(mes, retencion);
            }
        }

        let total = 0;
        for (const retencion of vigentePorMes.values()) {
            total += 
              this._toNum(retencion.retencion_base_mes) + 
              this._toNum(retencion.retencion_adicional_mes);
        }
        
        return Number(total.toFixed(2));
    }
}

module.exports = ObtenerIngresosPrevios;