const { FUENTE_PREVIOS } = require('../../shared/constants/tributario/quinta');

class ObtenerIngresosPrevios {
  constructor({ quintaRepo, bonoRepo, gratiRepo, asistenciaRepo } = {}) {
    // Solo instanciamos los repos reales si no vienen mocks
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
        trabajadorId, anio, mes, 
        remuneracionMensualActual,
        fuentePrevios = FUENTE_PREVIOS.AUTO,
        certificadoQuinta // {renta_bruta_total, retenciones_previas, etc }
    }) {
        // Primero debemos verificar si existe la planilla real 
        // Pero como no existe vamos a hacerlo de manera híbrida

        // Como no tenemos planilla real aún vamos a sacar del contrato vigente
        const contrato = await this.quintaRepo.getContratoVigente({ trabajadorId, anio, mes });
        console.log("contrato:", contrato)
        if (!contrato) {
            const err = new Error("No existe contrato vigente para este trabajador en la fecha indicada");
            err.status = 404;
            throw err;
        }

        // Si viene la remuneración mensual la utilizamos
        const sueldoBase = Number(remuneracionMensualActual ?? contrato.sueldo ?? 0);

        // Gratificaciones
        // Hacemos la proyección de julio o diciembre según el semestre
        let gratificaciones_total = 0;
        let gratiJulioTrabajador = 0;
        let gratiJulioProj = 0;
        let gratiDiciembreTrabajador = 0;
        let gratiDiciembreProj = 0;

        const filialId = contrato.filial_id || null;
        if (filialId) {
            const gratiJulio = await this.gratiRepo.calcularGratificaciones("JULIO", anio, filialId);
            const gratiDiciembre = await this.gratiRepo.calcularGratificaciones("DICIEMBRE", anio, filialId);
            
            const trabajadorGratiJulio = gratiJulio?.planilla?.trabajadores?.find(
                (t) => t.numero_documento === contrato.numero_documento
            );
            console.log("Gratificacies de Julio: ", trabajadorGratiJulio)
            const trabajadorGratiDiciembre = gratiDiciembre?.planilla?.trabajadores?.find(
                (t) => t.numero_documento === contrato.numero_documento
            );
            console.log("Gratificacies de Diciembre: ", trabajadorGratiDiciembre)
            
            if (Number(mes) <= 6) {
                gratiJulioProj = trabajadorGratiJulio?.total_a_pagar || 0;
                gratiDiciembreProj = trabajadorGratiDiciembre?.total_a_pagar || 0;
                gratificaciones_total = 0;
            } else if (Number(mes) >= 7 && Number(mes) <= 11) {
                gratiJulioTrabajador = trabajadorGratiJulio?.total_a_pagar || 0;
                gratiDiciembreProj = trabajadorGratiDiciembre?.total_a_pagar || 0;
                gratificaciones_total = Number(gratiJulioTrabajador);
            } else {
                gratiJulioTrabajador = trabajadorGratiJulio?.total_a_pagar || 0;
                gratiDiciembreTrabajador = trabajadorGratiDiciembre?.total_a_pagar || 0;
                gratificaciones_total = Number(gratiJulioTrabajador) + Number(gratiDiciembreTrabajador);
            }
        } 
        console.log("Gratificación después de filtrar: ", parseFloat(gratificaciones_total.toFixed(2)))
        
        // Rangos de fechas YYYY-MM-DD
        const pad2 = (n) => String(n).padStart(2, "0");
        const primerDiaDelMesActual = new Date(Number(anio), Number(mes) -1, 1);
        const ultimoDiaMesAnterior = new Date(Number(anio), Number(mes) - 1, 0);
        const ultimoDiaMesActual = new Date(Number(anio), Number(mes), 0);
        const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
        
        // Bonos acumulados hasta el mes anterior
        let bonos = 0;
        if (Number(mes) > 1) {
            bonos = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
                trabajadorId,
                `${anio}-01-01`,
                ymd(ultimoDiaMesAnterior)
            );
        }
            
        // Bonos y horas extras del mes actual
        const bonosDelMes = await this.bonoRepo.obtenerBonoTotalDelTrabajadorPorRangoFecha(
            trabajadorId,
            ymd(primerDiaDelMesActual),
            ymd(ultimoDiaMesActual)
        )
        console.log("Los bonos acumulados del mes actual comenzando desde: ", ymd(primerDiaDelMesActual),
            " Y terminando en: ", ymd(ultimoDiaMesActual), "son los siguientes: ", bonosDelMes
        )

        // Horas extras del mes
        const horasExtrasDelMes = await this.asistenciaRepo.obtenerHorasExtrasPorRangoFecha(
            trabajadorId,
            ymd(primerDiaDelMesActual),
            ymd(ultimoDiaMesActual)
        )
        console.log("Las horas extras acumuladas del mes actual comenzando desde: ", ymd(primerDiaDelMesActual),
            " Y terminando en: ", ymd(ultimoDiaMesActual), "son los siguientes: ", horasExtrasDelMes
        )

        // Construimos los ingresos previos según la FUENTE
        let resultado;
        if(fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS) {
            resultado = {
                remuneraciones: 0,
                gratificaciones: 0,
                gratiJulioTrabajador,
                gratiJulioProj: Number(gratiJulioProj),
                gratiDiciembreTrabajador,
                gratiDiciembreProj: Number(gratiDiciembreProj),
                bonos: 0,
                extraGravadoMes: Number((bonosDelMes || 0) + (horasExtrasDelMes || 0)),
                asignacion_familiar: 0,
                es_proyeccion: false,
                total_ingresos: 0
            };
        } else if (fuentePrevios === FUENTE_PREVIOS.CERTIFICADO && certificadoQuinta ) {
            const rentaBruta = Number(certificadoQuinta.renta_bruta_total || 0);
            resultado = {
                // Desgloce opcional (Si llega separado)
                remuneraciones: Number(certificadoQuinta.remuneraciones || 0),
                gratificaciones: Number(certificadoQuinta.gratificaciones || 0),
                bonos: Number(certificadoQuinta.otros || 0),
                asignacion_familiar: Number(certificadoQuinta.asignacion_familiar || 0),
                // Si vino sólo el total, lo usamos como total_ingresos
                total_ingresos: rentaBruta > 0
                    ? rentaBruta
                    : (Number(certificadoQuinta.remuneraciones || 0) +
                       Number(certificadoQuinta.gratificaciones || 0) +
                       Number(certificadoQuinta.otros || 0) +
                       Number(certificadoQuinta.asignacion_familiar || 0)),
                gratiJulioTrabajador,
                gratiJulioProj: Number(gratiJulioProj),
                gratiDiciembreTrabajador,
                gratiDiciembreProj: Number(gratiDiciembreProj),
                extraGravadoMes: Number((bonosDelMes || 0) + (horasExtrasDelMes || 0)),
                es_proyeccion: false
            };
        } else {
            //AUTO (proyección con contrato + gratificaciones pagadas/proyectadas + bonos previos + asignacion familiar)
            
            // Asignación familiar previa
            const asignacion_familiar = Number(contrato.valor_asignacion_familiar || 0) * (Number(mes) - 1);
            const remuneracionesPrevias = sueldoBase * (Number(mes) -1);
            // Construimos la respuesta detallada
            resultado = {
                remuneraciones: remuneracionesPrevias,  
                gratificaciones: Number(parseFloat(gratificaciones_total).toFixed(2)),
                gratiJulioTrabajador,
                gratiJulioProj: Number(gratiJulioProj),
                gratiDiciembreTrabajador,
                gratiDiciembreProj: Number(gratiDiciembreProj),
                bonos: Number(bonos || 0),
                extraGravadoMes: Number((bonosDelMes || 0) + (horasExtrasDelMes || 0)),
                asignacion_familiar: Number(asignacion_familiar || 0),
                es_proyeccion: true,
            };
            resultado.total_ingresos = 
                resultado.remuneraciones +
                resultado.gratificaciones +
                resultado.bonos +
                resultado.asignacion_familiar;
        }
        console.log("Ingresos previos acumulados: ", resultado)

        return resultado;
    }

    async _getRetencionesPrevias({ trabajadorId, anio, mes }) {
        const historicos = await this.quintaRepo.findByWorkerYear({ trabajadorId, anio });
        if (!Array.isArray(historicos) || historicos.length === 0) return 0;

        // Elegimos el "vigente" por mes: el último creado
        const vigentePorMes = new Map(); 
        const mesObj = Number(mes);

        for (const r of historicos) {
            const m = Number(r.mes);
            if (!Number.isFinite(m) || !(m < mesObj)) continue;

            const prev = vigentePorMes.get(m);
            if (!prev) {
                vigentePorMes.set(m, r);
                continue;
            }
            const dPrev = new Date(prev.createdAt || 0).getTime();
            const dCur = new Date(r.createdAt || 0).getTime();

            // Si el nuevo es más reciente, reemplazamos
            if (dCur > dPrev || (!dPrev && Number(r.id) > Number(prev.id))) {
                vigentePorMes.set(m, r);
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