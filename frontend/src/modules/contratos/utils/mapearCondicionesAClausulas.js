/**
 * Recibe:
 *  - definidas: string[] (todas las condiciones configuradas por administración)
 *  - cumplidas: string[] (marcadas como cumplidas en la cotización)
 * Retorna un array de cláusulas sugeridas { id, titulo, texto, activo }
 */
export default function mapearCondicionesAClausulas(definidas = [], cumplidas = []) {
  const out = [];

  const incluye = (needle) => definidas.some((c) => c.toLowerCase().includes(needle));
  const estaCumplida = (needle) =>
    cumplidas.some((c) => c.toLowerCase().includes(needle));

  // Ejemplos de reglas. Ajusta/añade según tus políticas:
  if (incluye("pago por adelantado")) {
    out.push({
      id: "pago-adelantado",
      titulo: "Forma de pago",
      texto:
        "El cliente acepta que la forma de pago será por adelantado antes del inicio de la prestación del servicio. El incumplimiento faculta al proveedor a suspender los trabajos sin responsabilidad alguna.",
      activo: true,
    });
  }

  if (incluye("título valor") || incluye("cheque") || incluye("letra de cambio")) {
    out.push({
      id: "titulo-valor-garantia",
      titulo: "Garantía mediante título valor",
      texto:
        "El Cliente entregará título(s) valor(es) (cheque o letra de cambio) por el monto total del valor del material alquilado, a nombre del proveedor, que serán devueltos al concluir el contrato y previa verificación del estado del material.",
      activo: estaCumplida("título valor") || estaCumplida("cheque") || estaCumplida("letra"),
    });
  }

  if (incluye("depósito en garantía") || incluye("garantía")) {
    out.push({
      id: "deposito-garantia",
      titulo: "Depósito en garantía",
      texto:
        "El Cliente deberá entregar un depósito en garantía equivalente a un (1) mes del arriendo. Este depósito no genera intereses y será devuelto al culminar el contrato, previa verificación del material.",
      activo: estaCumplida("garantía"),
    });
  }

  if (incluye("orden de servicio")) {
    out.push({
      id: "orden-servicio",
      titulo: "Orden de servicio",
      texto:
        "Antes de la prestación, el Cliente deberá emitir y remitir una Orden de Servicio firmada por su representante autorizado, la cual formará parte del presente contrato.",
      activo: estaCumplida("orden de servicio"),
    });
  }

  if (incluye("cuentas de banco") || incluye("transferencia")) {
    out.push({
      id: "cuentas-bancarias",
      titulo: "Cuentas bancarias",
      texto:
        "Los pagos se realizarán exclusivamente mediante transferencia bancaria a las cuentas del proveedor detalladas en el anexo del presente contrato.",
      activo: true,
    });
  }

  // Puedes añadir más mapeos específicos aquí:
  // if (incluye("...")) { out.push({...}) }

  return out;
}