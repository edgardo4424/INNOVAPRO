export function generarMensajeCondiciones(cotizacion, camposExtras = {}) {
  const equipo = `${cotizacion.uso?.descripcion || "—"}${camposExtras?.estimadoEquipo ? ` - ${camposExtras.estimadoEquipo}` : ""}`;
  const referencia = camposExtras.referencia || "—";
  const nota = camposExtras.nota || "—";
  const tiempo = camposExtras.tiempo || "—";

  return `
    CONDICIONES DE ALQUILER

    EQUIPO: ${equipo}
    TIEMPO: ${tiempo}
    REFERENCIA: ${referencia}
    NOTA: ${nota}
    `.trim();
}