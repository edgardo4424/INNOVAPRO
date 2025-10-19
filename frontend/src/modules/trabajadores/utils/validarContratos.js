import { formatearFecha } from "@/utils/formatearFecha";

/**
 * Valida una lista de contratos y detecta inconsistencias de fechas y solapamientos.
 * Si existe un contrato indefinido en una filial, no se permiten nuevos contratos en ese rango.
 * 
 * @param {Array} contratos - Listado de contratos laborales.
 * @param {boolean} permitirContinuidad - Si true, permite que un contrato termine el mismo día que otro inicia.
 * @returns {{ esValido: boolean, errores: string[] }}
 */
export function validarContratos(contratos = [], filiales, permitirContinuidad = false) {
  const errores = [];

  // Agrupar contratos por filial
  const contratosPorFilial = {};
  for (const c of contratos) {
    const filial = String(c.filial_id ?? "sin_filial");
    if (!contratosPorFilial[filial]) contratosPorFilial[filial] = [];
    contratosPorFilial[filial].push(c);
  }


  // Validar dentro de cada filial
  for (const [filial, lista] of Object.entries(contratosPorFilial)) {
    const indefinidos = lista.filter((c) => c.es_indefinido);
    
    const nombre_filial = filiales.find((f) => f.id == filial)?.razon_social;

    // 🧩 Validar si hay más de un contrato indefinido por filial
    if (indefinidos.length > 1) {
      const ids = indefinidos.map((c) => c.id).join(", ");
      errores.push(
        `La filial ${nombre_filial} tiene múltiples contratos indefinidos. Solo se permite uno por filial.`
      );
    }

    // Si hay un contrato indefinido activo → ningún contrato nuevo puede estar dentro o después
    const indefinido = indefinidos[0];
    if (indefinido) {
      const inicioIndef = new Date(indefinido.fecha_inicio);
      const finIndef = indefinido.fecha_fin ? new Date(indefinido.fecha_fin) : null;

      for (const c of lista) {
        if (c.id === indefinido.id) continue;

        const inicioC = new Date(c.fecha_inicio);
        const finC = c.fecha_fin ? new Date(c.fecha_fin) : null;

        const dentroDelIndefinido =
          inicioC >= inicioIndef && (!finIndef || inicioC <= finIndef);

        if (dentroDelIndefinido) {
          errores.push(
            `En la filial ${nombre_filial}, ya existe un contrato indefinido desde ${formatearFecha(
              indefinido.fecha_inicio
            )}. No se puede crear el contrato que inicia el ${formatearFecha(
              c.fecha_inicio
            )}.`
          );
        }
      }
    }

    // 🧩 Validación de fechas dentro de la misma filial
    const listaOrdenada = [...lista]
      .map((c, index) => ({
        ...c,
        fecha_inicio: c.fecha_inicio || "",
        fecha_fin: c.fecha_fin || "",
        posicion_contrato_sin_ordenar: index + 1,
      }))
      .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));

    for (let i = 0; i < listaOrdenada.length - 1; i++) {
      const actual = listaOrdenada[i];
      const siguiente = listaOrdenada[i + 1];

      if (!permitirContinuidad && actual.fecha_fin === siguiente.fecha_inicio) {
        errores.push(
          `En la filial ${nombre_filial}, el contrato N° ${siguiente.posicion_contrato_sin_ordenar} inicia el ${formatearFecha(
            siguiente.fecha_inicio
          )} y termina el mismo día que el contrato N° ${actual.posicion_contrato_sin_ordenar}.`
        );
      }

      if (actual.fecha_fin && actual.fecha_fin > siguiente.fecha_inicio) {
        errores.push(
          `En la filial ${nombre_filial}, el contrato N° ${siguiente.posicion_contrato_sin_ordenar} inicia el ${formatearFecha(
            siguiente.fecha_inicio
          )} y hay conflicto con el contrato anterior.`
        );
      }
    }
  }

  return {
    esValido: errores.length === 0,
    errores,
  };
}
