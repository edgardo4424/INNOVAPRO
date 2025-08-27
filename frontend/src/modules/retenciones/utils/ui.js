// Utilidades de retenciones (formatos y helpers)

export const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

/** Muestra "Nombre Apellidos – DNI: 12345678" (o tipo + nro) */
export function displayTrabajador(t) {
  const tipo = t.tipo_documento || (t.documento_label ?? "");
  const nro  = t.numero_documento || t.dni || "";
  const name = [t.nombres, t.apellidos].filter(Boolean).join(" ") || "";
  const label = [name, tipo && nro ? `– ${tipo}: ${nro}` : ""].join(" ").trim();
  return { label, numero_documento: nro };
}

export function parseMySQLDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  const iso = String(v).replace(" ", "T"); // YYYY-MM-DDTHH:mm:ss
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export function formatFechaCorta(v) {
  const d = parseMySQLDate(v);
  return d
    ? d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
}

export function nombreMes(m) {
  const n = Number(m);
  if (!n || n < 1 || n > 12) return String(m ?? "");
  const s = new Date(2025, n - 1, 1).toLocaleDateString("es-PE", { month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}