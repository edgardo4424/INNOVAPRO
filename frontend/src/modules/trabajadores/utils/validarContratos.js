import { formatearFecha } from "@/utils/formatearFecha";

/**
 * Valida una lista de contratos y detecta inconsistencias de fechas.
 * @param {Array} contratos - Listado de contratos (cada uno con fecha_inicio, fecha_fin, id, etc.)
 * @param {boolean} permitirContinuidad - Si true, permite que un contrato termine el mismo día que otro inicia.
 * @returns {{ esValido: boolean, errores: string[] }}
 */
export function validarContratos(contratos = [], permitirContinuidad = false) {

    console.log('contratos', contratos);
  const errores = [];

  // 🧩 Validación: contratos indefinidos por filial
  const indefinidosPorFilial = {};
  for (const c of contratos) {
    if (c.es_indefinido) {
      const filial = String(c.filial_id);
      if (indefinidosPorFilial[filial]) {
        errores.push(
          `Ya existe un contrato indefinido en la filial ${filial} (ID ${indefinidosPorFilial[filial].id}). No se puede registrar otro indefinido en la misma filial (ID ${c.id}).`
        );
      } else {
        indefinidosPorFilial[filial] = c;
      }
    }
  }

  // Si ya hay errores de indefinidos, devolvemos directamente
  if (errores.length > 0) {
    return {
      esValido: false,
      errores,
    };
  }

  // 🧩 Validaciones de fechas
  const listaOrdenada = [...contratos]
    .map(c => ({
      ...c,
      fecha_inicio: c.fecha_inicio || "",
      fecha_fin: c.fecha_fin || "",
    }))
    .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));

  for (let i = 0; i < listaOrdenada.length - 1; i++) {
    const actual = listaOrdenada[i];
    const siguiente = listaOrdenada[i + 1];

    // 2️⃣ Contratos que terminan el mismo día que otro inicia
    if (!permitirContinuidad && actual.fecha_fin === siguiente.fecha_inicio) {
      errores.push(
        `El contrato N° ${i + 2} inicia el ${formatearFecha(
          siguiente.fecha_inicio
        )} y termina el mismo día que el contrato N° ${i + 1}.`
      );
    }

    // 3️⃣ Solapamiento (fecha_fin > fecha_inicio del siguiente)
    if (actual.fecha_fin && actual.fecha_fin > siguiente.fecha_inicio) {
      errores.push(
        `El contrato N° ${i + 2} inicia el ${formatearFecha(
          siguiente.fecha_inicio
        )} y hay conflicto con el contrato anterior.`
      );
    }
  }

  return {
    esValido: errores.length === 0,
    errores,
  };
}