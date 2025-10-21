import { useId, useState } from "react";

export const sumarDias = (fecha, numeroDias) => {
  if (!fecha) return "";
  const date = new Date(fecha + "T00:00:00");
  date.setDate(date.getDate() + numeroDias);
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mes}-${dia}`;
};
export const hoyEnFormatoISO = () => {
  const date = new Date();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mes}-${dia}`;
};

export function parsearCondicionesBackend(condicionRaw) {
  if (!condicionRaw?.condiciones)
    return { definidas: [], observacion: null, cumplidasIniciales: [] };

  const textoCondiciones = (condicionRaw.condiciones.split("CONDICIONES AUTORIZADAS:")[1] || "");
  const lineas = textoCondiciones.split("•").map((c) => c.trim()).filter(Boolean);

  let definidas = [];
  let observacion = null;

  lineas.forEach((linea) => {
    if (/OBSERVACIÓN:/i.test(linea)) {
      const partes = linea.split(/OBSERVACIÓN:/i);
      if (partes[0].trim()) definidas.push(partes[0].trim());
      observacion = (partes[1] || "").trim();
    } else {
      definidas.push(linea);
    }
  });

  const cumplidasIniciales = condicionRaw.condiciones_cumplidas || [];
  return { definidas, observacion, cumplidasIniciales };
}

/** Tooltip accesible (sin libs) */
export function Tooltip({ label, children, side = "top" }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const pos =
    side === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
      : side === "right"
      ? "left-full top-1/2 -translate-y-1/2 ml-2"
      : side === "left"
      ? "right-full top-1/2 -translate-y-1/2 mr-2"
      : "top-full left-1/2 -translate-x-1/2 mt-2";

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`pointer-events-none absolute z-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg ${pos} w-64 max-w-xs text-left leading-relaxed`}
        >
          {label}
        </span>
      )}
    </span>
  );
}