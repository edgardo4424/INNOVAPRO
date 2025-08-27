import { FUENTE_PREVIOS } from "./quinta.constants";

/**
 * @typedef {Object} CalculoRow
 * @property {number|string} id
 * @property {string|number|Date} createdAt
 * @property {number|string} mes
 * @property {number|string|null} retencion_base_mes
 * @property {number|string|null} retencion_adicional_mes
 * @property {boolean|0|1} [es_recalculo]
 */

/** Normaliza el enum de fuente de previos a una de las 3 permitidas. */
export function normalizarFuentePrevios(valor) {
  if (!valor) return FUENTE_PREVIOS.AUTO;
  const fuenteFinal = String(valor).trim().toUpperCase().replace(/\s+/g, "_");
  return FUENTE_PREVIOS[fuenteFinal] ? fuenteFinal : FUENTE_PREVIOS.AUTO;
}

/** Convierte una fila cruda del historial a una forma segura para la UI. */
export function normalizarCalculo(fila) {
  return {
    id: fila.id,
    createdAt: fila.createdAt,
    mes: Number(fila.mes),
    retencion_base_mes: Number(fila.retencion_base_mes ?? 0),
    retencion_adicional_mes: Number(fila.retencion_adicional_mes ?? 0),
    es_recalculo: fila.es_recalculo === true || fila.es_recalculo === 1,
  };
}

/**
 * Mostrar por mes conservando el MÁS RECIENTE según createdAt (fallback por id).
 * @param {Array<CalculoRow>} filas
 */
export function mostrarUltimoRegistroPorMes(filas) {
  // Creamos un map para mapear almacenar el último registro de cada mes
  // La clave será el número del mes y el valor la fila más reciente
  const registrosPorMes = new Map();

  // Recorremos cada fila de la lista recibida
  for (const fila of filas) {
    // Normalizamos cada fila de la iteración
    const filaNormalizada = normalizarCalculo(fila);

    // Buscamos si ya tenemos un registro guardado para este mismo mes
    const registroPrevio = registrosPorMes.get(filaNormalizada.mes);

    // Si no hay registro para ese mes, lo guardamos y continuamos al siguiente
    if (!registroPrevio) { 
        registrosPorMes.set(filaNormalizada.mes, filaNormalizada); 
        continue; 
    }

    // Si ya había un registro, comparamos cuál es más reciente:
    // Obtenemos la fecha de creación del anterior
    const fechaPrev = new Date(registroPrevio.createdAt || 0).getTime();
    // Obtenemos la fecha de creación de la fila actual
    const fechaActual  = new Date(filaNormalizada.createdAt || 0).getTime();

    // Si la fila actual es más reciente que la previa, o son de la misma fecha,
    // usamos el id para decidir cuál conservar
    const esMasReciente =
        fechaActual > fechaPrev ||
        (!fechaPrev && filaNormalizada.id > registroPrevio.id);
    
    if(esMasReciente) {
        registrosPorMes.set(filaNormalizada.mes, filaNormalizada);
    }
  }

  // Al final, convertimos el Map a un array de filas,
  // y lo ordenamos de más reciente a más antiguo usando createdAt.
  return Array.from(registrosPorMes.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

/** Extrae arrays de múltiples formatos de respuesta de API. */
export function extraerFilas(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  return [];
}