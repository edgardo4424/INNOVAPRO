// INNOVA PRO+ v1.2.1 — Servicio: ingresos previos REALES desde planillas cerradas (ENE..mes-1)
"use strict";
const { pad2, round2} = require('../../shared/utils/helpers');
/**
 * Requiere del repo: planillaRepo.obtenerPlanillaMensualCerradas(YYYY-MM, filial_id) -> Array<fila>
 * Mapea exactamente los campos de tu respuesta real:
 *  - DNI: numero_documento
 *  - remuneraciones: sueldo_del_mes || sueldo_basico
 *  - gratificaciones: gratificacion
 *  - bonos/otros gravados: bono_primera_quincena + bono_segunda_quincena + h_extras_primera_quincena + h_extras_segunda_quincena
 *  - asignación familiar: asig_fam
 *  - retenciones quinta: quinta_categoria
 * Nota: NO usamos sueldo_bruto para evitar doble conteo con AF.
 */

function mapFilaPlanillaToConceptos(row) {
  // Identidad
  const dni = row.numero_documento || null;
  const trabajador_id = row.trabajador_id || null;

  // Conceptos (valores reales)
  const remuneraciones = row.sueldo_del_mes || row.sueldo_basico;

  const gratificaciones = row.gratificacion;

  const horasExtras = row.h_extras_primera_quincena + row.h_extras_segunda_quincena;

  const bonos = row.bono_primera_quincena + row.bono_segunda_quincena + horasExtras;

  const asignacion_familiar = row.asig_fam;

  const vacaciones = row.vacaciones + row.vacaciones_vendidas;

  const retenciones = row.quinta_categoria;

  const total_ingresos = round2(remuneraciones + gratificaciones + bonos + asignacion_familiar + vacaciones);

  return {
    dni,
    trabajador_id,
    remuneraciones: round2(remuneraciones),
    gratificaciones: round2(gratificaciones),
    bonos: round2(bonos),
    asignacion_familiar: round2(asignacion_familiar),
    retenciones: round2(retenciones),
    total_ingresos,
    es_proyeccion: false,
  };
}

async function calcularIngresosPreviosRealesDesdePlanilla({
  anio,
  mes,
  filialId,
  planillaRepo,
  dnisFiltrados = null,
}) {
  if (!anio && !mes && !filialId) {
    const error = new Error("Parámetros inválidos para calcularIngresosPreviosRealesDesdePlanilla");
    error.status = 400;
    throw error;
  }
  if (!planillaRepo || typeof planillaRepo.obtenerPlanillaMensualCerradas !== "function") {
    const error = new Error("planillaRepo inválido: falta obtenerPlanillaMensualCerradas(YYYY-MM, filial_id)");
    error.status = 500;
    throw error;
  }

  if (mes <= 1) return new Map();

  const mapa = new Map(); // key = dni

  for (let m = 1; m <= (mes - 1); m++) {

    const periodo = `${anio}-${pad2(m)}`;
    

    let filas = [];

    try {
      filas = await planillaRepo.obtenerPlanillaMensualCerradas(periodo, filialId);
    } catch (err) {
      // Mes sin cierre o error; continuar sin romper el flujo
      console.warn(`[IngresosPrevios][Planilla] No se pudo leer periodo=${periodo} filial=${filialId}:`, err?.message || err);
      continue;
    }

    if (!Array.isArray(filas) || filas.length === 0) continue;

    for (const row of filas) {
      const conceptos = mapFilaPlanillaToConceptos(row);
      
      if (!conceptos.dni) continue;

      if (Array.isArray(dnisFiltrados) && dnisFiltrados.length > 0 && !dnisFiltrados.includes(conceptos.dni)) {
        continue;
      }

      const prev = mapa.get(conceptos.dni) || {
        trabajador_id: conceptos.trabajador_id ?? null,
        remuneraciones: 0,
        gratificaciones: 0,
        bonos: 0,
        asignacion_familiar: 0,
        retenciones: 0,
        total_ingresos: 0,
        es_proyeccion: false,
      };

      const next = {
        trabajador_id: prev.trabajador_id ?? conceptos.trabajador_id ?? null,
        remuneraciones: round2(prev.remuneraciones + conceptos.remuneraciones),
        gratificaciones: round2(prev.gratificaciones + conceptos.gratificaciones),
        bonos: round2(prev.bonos + conceptos.bonos),
        asignacion_familiar: round2(prev.asignacion_familiar + conceptos.asignacion_familiar),
        retenciones: round2(prev.retenciones + conceptos.retenciones),
        total_ingresos: 0, 
        es_proyeccion: false,
      };
      next.total_ingresos = round2(
        next.remuneraciones + next.gratificaciones + next.bonos + next.asignacion_familiar
      );

      mapa.set(conceptos.dni, next);
    }
  }

  return mapa;
}

module.exports = {
  calcularIngresosPreviosRealesDesdePlanilla,
  _mapFilaPlanillaToConceptos: mapFilaPlanillaToConceptos,
};