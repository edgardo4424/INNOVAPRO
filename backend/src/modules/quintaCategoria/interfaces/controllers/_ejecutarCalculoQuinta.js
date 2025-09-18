
// REPOSITORIOS (INFRAESTRUCTURA)
const SequelizeDeclaracionesSinPreviosRepository = require('../../infrastructure/repositories/SequelizeDeclaracionSinPreviosRepository');
// CASOS DE USO
const ObtenerIngresosPrevios = require('../../application/useCases/obtenerIngresosPrevios');
const CalcularQuintaProyectada = require('../../application/useCases/calcularQuintaProyectada');
// INSTANCIAS DE LOS REPOSITORIOS
const sinPrevRepo = new SequelizeDeclaracionesSinPreviosRepository();
// INSTANCIAS DE LOS CASOS DE USO
const obtenerIngresosUC = new ObtenerIngresosPrevios();
const calcularUC = new CalcularQuintaProyectada();
// UTILIDADES 
const { _baseVacia } = require('../../shared/utils/helpers');
const enriquecerConContratoOFalla = require('../../shared/utils/enriquecerConContratoOFalla'); 
const { aplicarSoportesPrevios } = require('../../application/services/AplicarSoportesPrevios');
const construirWarnings = require('../../shared/utils/construirWarnings');
// Leer soportes efectivos
const _leerSoportesEfectivos = require('../../shared/utils/leerSoportesEfectivos');

// --- FUNCIÓN CENTRALIZADA DE CÁLCULO ---
module.exports = async function _ejecutarCalculoQuinta(req, isRecalculo = false) {
  // Contrato + elegibilidad
  const error = await enriquecerConContratoOFalla(req);
  if (error) return res.status(error.status).json({ ok: false, message: error.message });

  // Normalizaciones de entrada
  const filialActualId = Number(req.body.__filialId);
  const dni = String(req.body.dni || "");
  const anio = Number(req.body.anio);
  const mes  = Number(req.body.mes);

  const contratoId   = Number(req.body.contratoId);
  const trabajadorId = Number(req.body.__trabajadorId || req.body.trabajadorId);

  const fuentePrevios = String(req.body.fuentePrevios || 'AUTO').toUpperCase();
  const remuneracionMensualActual = Number(req.body.remuneracionMensualActual || 0);

  // DJ Sin previos: “cutoff” por mes
  const djSinPrevios = await sinPrevRepo.obtenerPorDniAnio({ dni, anio });
  const sinPreviosAplicaDesde = Number(djSinPrevios?.aplica_desde_mes || 0) || null;

  //  BASE de ingresos previos (ya recortada si aplica DJ sin previos)
  let base = await obtenerIngresosUC.execute({
    trabajadorId,
    dni,
    anio,
    mes,
    remuneracionMensualActual,
    fuentePrevios,
    certificadoQuinta: null,
    filialIdPreferida: filialActualId,
    contratoId,
    asignacion_familiar: req.body.__tiene_asignacion_familiar || false,
    asignacion_familiar_desde: req.body.__asignacion_familiar_desde || "",
    sinPreviosAplicaDesde 
  });

  // Defensa: jamás dejar base undefined
  if (!base || typeof base !== 'object') base = _baseVacia();

  // Consolidar Soportes efectivos (certificado, multiempleo, sin previos)
  const soportes = await _leerSoportesEfectivos({
    dni, anio: Number(anio), mes: Number(mes), filialId: filialActualId 
  });

  // Sumar EXTERNOS (DJ/Certificado) al acumulado interno de la base
  const extPrevios = Number(soportes.meta?.ingresos_previos_externos || 0);
  if (extPrevios > 0) {
    base.total_ingresos = Number((Number(base.total_ingresos || 0) + extPrevios).toFixed(2));;
  }

  // Retenciones previas: internas (DB) + externas (DJ/Cert)
  const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({trabajadorId, anio, mes });
  const retencionesPrevias = Number(retPreviasDB || 0) + Number(soportes.meta?.retenciones_previas_externas || 0);

  // Payload para el UC de cálculo (antes de aplicar DJ SinPrevios)
  let payload = {
    dni,
    trabajadorId,
    anio,
    mes,
    contratoId,
    remuneracionMensualActual,
    ingresos_previos_internos: Number(soportes.meta?.ingresos_previos_internos || 0),
    retenciones_previas_internas: soportes.saltarRetener ? 0 : Number(soportes.meta?.retenciones_previas_internas || 0),
    ingresosPrevios: base,
    retencionesPrevias: retencionesPrevias, 
    esProyeccion: !!base.es_proyeccion,
    fuentePrevios,
    otrosIngresosProyectados: Number(req.body.otrosIngresosProj || 0),
  };

  // Aplicar DJ “Sin previos” (si mes < aplica: total a 0)
  payload = await aplicarSoportesPrevios({ dni, anio, mes, payload })

  // Calcular
  const dto = await calcularUC.execute(payload);

  // Si somos secundarios la retención base del mes = 0
  if (soportes.meta.es_secundaria) {
    dto.retencion_base_mes = 0;
    dto.retencion_adicional_mes = 0;
  }

  // Warnings
  const warnings = construirWarnings({
    base,
    soportes,
    mesNum: Number(mes),
    retPreviasDB
  });
  
  return {
    dto,
    ctx: {
      dni, anio, mes,
      trabajadorId, contratoId, filialActualId,
      fuentePrevios, remuneracionMensualActual,
      base, soportes, retPreviasDB, retencionesPrevias, payload, warnings
    }
  };
}