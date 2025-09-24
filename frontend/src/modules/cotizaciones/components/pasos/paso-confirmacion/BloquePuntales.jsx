import { useState } from "react";

export default function BloquePuntales({ formData, setFormData }) {
  const tipo = formData.cotizacion.tipo; // Alquiler o Venta
  const dias = formData.cotizacion.duracion_alquiler || 30;
  const formatear = (n) => isNaN(n) ? "—" : n.toFixed(2);
  
  const puntales = formData.uso.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("PUNTAL")
  );

  if (puntales.length === 0) return null;

  // ✅ Estado local inicializado una sola vez
  const initialPrecios = {};
  for (const p of puntales) {
    let base;
    if (tipo === "Alquiler") {
      base = p.precio_diario_manual ?? p.precio_u_alquiler_soles / 30;
    } else {
      base = p.precio_venta_manual ?? p.precio_u_venta_soles;
    }
    initialPrecios[p.pieza_id] = base.toFixed(2) ?? "0.00";
  }
  const [preciosLocales, setPreciosLocales] = useState(initialPrecios);

  const calcularResumen = (despiece) => {
    let total_piezas = 0;
    let peso_total_kg = 0;
    let subtotal_alquiler = 0;
    let subtotal_venta = 0;

    for (const p of despiece) {
      if (p.incluido === false) continue;
      total_piezas += parseFloat(p.total || 0);
      peso_total_kg += parseFloat(p.peso_kg || 0);
      subtotal_alquiler += parseFloat(p.precio_alquiler_soles || 0);
      subtotal_venta += parseFloat(p.precio_venta_soles || 0);
    }

    return {
      total_piezas,
      peso_total_kg: peso_total_kg.toFixed(2),
      peso_total_ton: (peso_total_kg / 1000).toFixed(2),
      precio_subtotal_venta_dolares: 0,
      precio_subtotal_venta_soles: subtotal_venta.toFixed(2),
      precio_subtotal_alquiler_soles: subtotal_alquiler.toFixed(2)
    };
  };

  const handleBlur = (pieza, precioStr) => {
    const valor = parseFloat(precioStr);
    if (isNaN(valor)) return;

    const despieceActualizado = formData.uso.despiece.map(p => {
      if (p.pieza_id === pieza.pieza_id) {     
        if (tipo === "Alquiler") {
          const subtotal = parseFloat((valor * dias * p.total).toFixed(2));
          return {
            ...p,
            precio_diario_manual: valor,
            precio_u_alquiler_soles: parseFloat((valor * dias).toFixed(2)),
            precio_alquiler_soles: subtotal
          };
        } else {
          const subtotal = parseFloat((valor * p.total).toFixed(2))
          return {
            ...p,
            precio_venta_manual: valor,
            precio_u_venta_soles: valor,
            precio_venta_soles: subtotal
          }
        }
      }
      return p;
    });

    const nuevoResumen = calcularResumen(despieceActualizado);

    setFormData(prev => ({
      ...prev,
      uso: {
        ...prev.uso,
        despiece: despieceActualizado,
        resumenDespiece: nuevoResumen,
        despiece_editado_manualmente: true // Para evitar que el useEffect del useGenerarDespiece nos borre la actualización
      },
    }));
  };

  return (
    <div className="wizard-section">
      {puntales.length > 0 && (
        <>
          <h4 className="text-base font-semibold text-orange-700 mb-2">
            🛠️ Ajustar precio diario de los PUNTALES
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Aquí puedes editar el <strong>precio diario (S/)</strong> para cada tipo de PUNTAL. El subtotal se calcula automáticamente por 30 días.
          </p>
    
          {puntales.map((pieza) => {
            const tipo = pieza.descripcion?.match(/PUNTAL (\d+\.\d+)/i)?.[1] || "—";
            const precioLocal = preciosLocales[pieza.pieza_id] ?? "0.00";
            const subtotal = (parseFloat(precioLocal) * dias * pieza.total).toFixed(2);

            return (
              <div key={pieza.pieza_id} className="mb-3">
                <label className="block font-medium text-sm text-gray-700 mb-1">
                  PUNTAL {tipo} m — {pieza.total} unidades
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="border p-2 rounded w-[120px]"
                    value={precioLocal}
                    onChange={(e) =>
                      setPreciosLocales(prev => ({
                        ...prev,
                        [pieza.pieza_id]: e.target.value
                      }))
                    }
                    onBlur={() => handleBlur(pieza, precioLocal)}
                  />
                  <span className="text-sm text-gray-600">
                    {tipo === "Alquiler" ? "S/ por día" : "S/ unitario"}
                  </span>
                  <span className="ml-auto text-sm text-blue-900">
                    Subtotal: <strong>S/{formatear(
                      tipo === "Alquiler"
                        ? parseFloat(precioLocal) * dias * pieza.total
                        : parseFloat(precioLocal) * pieza.total
                    )}</strong>
                  </span>
                </div>
              </div>
            );
          })}
      </>
    )}
      
    </div>
  );
}