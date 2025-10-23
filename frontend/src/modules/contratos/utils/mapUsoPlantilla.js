/**
 * Dado el JSON del contrato (el que usas para merge) y/o metadatos,
 * devuelve la carpeta de USO esperada en el filesystem:
 *   - Para ENCOFRADOS, INDEK, RENTAL, GREEN: "01. CONTRATOS (CC)" o "02. LETRAS"
 *   - Para ANDAMIOS ELÉCTRICOS: "01. PLAN BASICO" | "02. PLAN INTERMEDIO" | "03. PLAN INTEGRAL" | "04. TRANSPORTE" | "05. VENTA - OTROS" | "06. LETRAS"
 *
 * Devuelve null si no puede inferir (para que UI liste todos los usos de la filial).
 */
export function mapUsoPlantilla({ filialNombre, mergeData }) {
  const d = mergeData || {};
  const flags = {
    tieneLetra: d?.tieneLetra === true,
    esTransporte: /transporte/i.test(d?.contrato?.tipo || "") || /transporte/i.test(d?.uso || ""),
    esVenta: /venta/i.test(d?.contrato?.tipo || "") || /venta/i.test(d?.uso || ""),
    plan: (d?.plan || d?.contrato?.plan || "").toString().toLowerCase(), // "basico", "intermedio", "integral"
  };

  const isAndamios = /andamios/i.test(filialNombre || "");
  const isOther = !isAndamios; // ENCOFRADOS/INDEK/RENTAL/GREEN

  if (isAndamios) {
    if (flags.tieneLetra) return "06. LETRAS";
    if (flags.esTransporte) return "04. TRANSPORTE";
    if (flags.esVenta) return "05. VENTA - OTROS";
    if (flags.plan.includes("integral")) return "03. PLAN INTEGRAL";
    if (flags.plan.includes("intermedio")) return "02. PLAN INTERMEDIO";
    if (flags.plan.includes("basico") || flags.plan.includes("básico")) return "01. PLAN BASICO";
    // Fallback más usado en AEI
    return "01. PLAN BASICO";
  }

  if (isOther) {
    if (flags.tieneLetra) return "02. LETRAS";
    // Contratos civiles estándar
    return "01. CONTRATOS (CC)";
  }

  return null;
}