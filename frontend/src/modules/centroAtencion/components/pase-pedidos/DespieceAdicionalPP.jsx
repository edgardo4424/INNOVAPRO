import { useEffect, useMemo, useRef, useState } from "react";
import useDespieceManualOT from "../../hooks/useDespieceManualOT";
import { Plus } from "lucide-react";

export default function DespieceAdicionalPP({
  formData,
  setFormData,
  piezasObtenidas,
}) {
  const [showList, setShowList] = useState(false);
  const containerRef = useRef(null);
  const [piezasDisponibles, setPiezasDisponibles] = useState(
    piezasObtenidas || [],
  );
  const [inputText, setInputText] = useState("");
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null); // objeto pieza o null
  const [cantidad, setCantidad] = useState("");

  useEffect(() => {
    setPiezasDisponibles(piezasObtenidas || []);
    // si la pieza seleccionada ya no existe, limpiar
    if (
      piezaSeleccionada &&
      !(piezasObtenidas || []).some((p) => p.id === piezaSeleccionada.id)
    ) {
      setPiezaSeleccionada(null);
      setInputText("");
    }
  }, [piezasObtenidas]);

  // Helpers
  const makeLabel = (p) => `${p.item} - ${p.descripcion}`.trim();

  // Mapa label→pieza para reconocer cuando el usuario selecciona exactamente una opción del datalist
  const labelMap = useMemo(() => {
    const m = new Map();
    for (const p of piezasDisponibles) m.set(makeLabel(p), p);
    return m;
  }, [piezasDisponibles]);

  // Sugerencias filtradas (máx 50 para que sea ágil)
  const suggestions = useMemo(() => {
    const q = (inputText || "").toLowerCase().trim();
    if (!q) return piezasDisponibles.slice(0, 50);
    return piezasDisponibles
      .filter(
        (p) =>
          p.item?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [inputText, piezasDisponibles]);

  const { despieceManual, agregarPieza, eliminarPieza } = useDespieceManualOT({
    tipoCotizacion: formData.tipo_cotizacion,
    formData,
    onResumenChange: ({ nuevoDespiece }) => {
      const despieceOriginal = formData.despiece || [];

      const despieceFinal = [
        ...despieceOriginal.filter((p) => !p.esAdicional),
        ...nuevoDespiece.map((p) => ({ ...p, esAdicional: true })),
      ];

      const sum = (arr, f) =>
        arr.reduce((acc, p) => acc + (parseFloat(f(p)) || 0), 0);
      const pesoTotalKg = sum(despieceFinal, (p) => p.peso_kg).toFixed(2);

      const resumenFinal = {
        total_piezas: sum(despieceFinal, (p) => p.total),
        peso_total_kg: pesoTotalKg,
        peso_total_ton: (parseFloat(pesoTotalKg) / 1000).toFixed(2),
        precio_subtotal_venta_soles: sum(
          despieceFinal,
          (p) => p.precio_venta_soles,
        ).toFixed(2),
        precio_subtotal_alquiler_soles: sum(
          despieceFinal,
          (p) => p.precio_alquiler_soles,
        ).toFixed(2),
        precio_subtotal_venta_dolares: 0,
      };

      setFormData((prev) => ({
        ...prev,
        despiece: despieceFinal,
        resumenDespiece: resumenFinal,
      }));
    },
  });

  // Resolver la pieza a agregar: prioriza selección explícita; si no, usa match exacto por label; si tampoco, única coincidencia
  const resolvePiezaToAdd = () => {
    if (piezaSeleccionada) return piezaSeleccionada;
    if (labelMap.has(inputText)) return labelMap.get(inputText);
    if (suggestions.length === 1) return suggestions[0];
    return null;
    // Nota: si hay múltiples coincidencias y no hay selección clara, no agregamos.
  };

  const handleAgregar = () => {
    const pieza = resolvePiezaToAdd();
    const qty = parseInt(cantidad, 10);

    if (!pieza || !(qty > 0)) return;

    const exito = agregarPieza(pieza, qty);
    if (exito) {
      setCantidad("");
      setPiezaSeleccionada(null);
      setInputText("");
    }
  };

  // Cerrar lista si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const piezasVisuales = (formData.despiece || []).filter((p) => p.esAdicional);

  return (
    <div className="wizard-section">
      <h4 className="text-xl font-bold flex gap-x-2 ">
        <Plus className="text-purple-600" /> Agregar piezas adicionales al despiece
      </h4>

      <div className="flex flex-wrap items-end-safe justify-between gap-4">
        <div className="relative w-[300px] flex-[3]" ref={containerRef}>
          <label>Buscar pieza:</label>
          <input
            type="text"
            placeholder="Ej: AM.0100 o Husillo"
            value={inputText}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2"
            onFocus={() => setShowList(true)}
            onChange={(e) => {
              const value = e.target.value;
              setInputText(value);
              const exact = labelMap.get(value);
              setPiezaSeleccionada(exact || null);
              setShowList(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAgregar();
                setShowList(false);
              }
            }}
          />

          {/* Lista personalizada (debajo del input) */}
          {showList && suggestions.length > 0 && (
            <ul
              className="absolute right-0 left-0 z-10 max-h-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md"
              style={{ top: "calc(100% + 4px)" }}
            >
              {suggestions.map((pieza) => (
                <li
                  key={pieza.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  onMouseDown={() => {
                    // usar onMouseDown (no onClick) para que no se dispare blur antes
                    setInputText(`${pieza.item} - ${pieza.descripcion}`);
                    setPiezaSeleccionada(pieza);
                    setShowList(false);
                  }}
                >
                  {pieza.item} — {pieza.descripcion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-[100px] flex-[1]">
          <label>Cantidad:</label>
          <input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            min="1"
            value={cantidad}
            onChange={(e) => {
              const v = e.target.value;
              // permitir cadena vacía para borrar, o número >= 1
              if (v === "" || Number(v) >= 1) setCantidad(v);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2"
          />
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <button
            type="button"
            onClick={handleAgregar}
            className="border-innova-blue bg-innova-blue w-full rounded-md border px-4 py-2 text-white disabled:cursor-not-allowed"
            disabled={!resolvePiezaToAdd() || !(parseInt(cantidad, 10) > 0)}
          >
            Agregar
          </button>
        </div>
      </div>

      {piezasVisuales.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h5>Piezas adicionales:</h5>
          <ul style={{ paddingLeft: 0 }}>
            {despieceManual.map((pieza, idx) => (
              <li
                key={`${pieza.id}-${idx}`}
                style={{
                  marginBottom: "0.5rem",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.3rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong>{idx + 1}.</strong> {pieza.descripcion} —{" "}
                  <strong>{pieza.cantidad}</strong> unidades
                </span>
                <button
                  onClick={() => eliminarPieza(pieza.pieza_id)}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.2rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
