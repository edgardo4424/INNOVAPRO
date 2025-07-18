import { useState } from "react";

export default function BloqueEscuadras({ formData, setFormData }) {
  const tipo = formData.tipo_cotizacion; // Alquiler o Venta
  
  const formatear = (n) => isNaN(n) ? "—" : n.toFixed(2);
  
  const escuadras = formData.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("ESCUADRA")
  );

  const plataformas = formData.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("PLATAFORMA")
  );


  if (escuadras.length === 0) return null;
  if (plataformas.length === 0) return null;

  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  // Calcular subtotal original y actual de plataformas
    const totalOriginal = plataformas.reduce((acc, p) => {
    const precioOriginal = p.precio_original_alquiler_soles || parseFloat(p.precio_u_alquiler_soles || 0);
    return acc + (precioOriginal * p.total);
    }, 0);

    const totalActual = plataformas.reduce((acc, p) => {
    return acc + parseFloat(p.precio_alquiler_soles || 0);
    }, 0);


  const aplicarDescuentoPlataformas = (porcentaje) => {
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) return;
    const factor = 1 - porcentaje / 100;
    const despieceActualizado = formData.despiece.map(p => {
        if (p.descripcion?.toUpperCase().includes("PLATAFORMA")) {
            const precioOriginal = p.precio_original_alquiler_soles || parseFloat(p.precio_u_alquiler_soles || 0);
            const nuevoPrecio = parseFloat((precioOriginal * factor).toFixed(2));
            const nuevoSubtotal = parseFloat ((nuevoPrecio * p.total).toFixed(2));

            return {
                ...p,
                precio_original_alquiler_soles: precioOriginal,
                precio_u_alquiler_soles: nuevoPrecio,
                precio_alquiler_soles: nuevoSubtotal,
                descuento_aplicado: porcentaje
            };
        }
        return p;
    });

    const nuevoResumen = calcularResumen(despieceActualizado);

    setFormData(prev => ({
        ...prev,
        despiece: despieceActualizado,
        resumenDespiece: nuevoResumen,
        descuento_plataformas: porcentaje,
        despiece_editado_manualmente: true
    }))
  }

  
  console.log("Escuadras", escuadras)

  // ✅ Estado local inicializado una sola vez
  const initialPrecios = {};
  let cantidad_escuadras = 0;
  for (const p of escuadras) {
    let base;
    if (tipo === "Alquiler") {
      base = p.precio_manual ?? p.precio_u_alquiler_soles;
    } else {
      base = p.precio_venta_manual ?? p.precio_u_venta_soles;
    }
    initialPrecios[p.pieza_id] = base.toFixed(2) ?? "0.00";
    cantidad_escuadras += p.total;
  }
  console.log("Cantidad de escuadras : ", cantidad_escuadras )
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

    const despieceActualizado = formData.despiece.map(p => {
      if (p.pieza_id === pieza.pieza_id) {     
        if (tipo === "Alquiler") {
          const subtotal = parseFloat((valor * p.total).toFixed(2));
          return {
            ...p,
            precio_manual: valor,
            precio_u_alquiler_soles: parseFloat((valor).toFixed(2)),
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
      despiece: despieceActualizado,
      resumenDespiece: nuevoResumen,
      despiece_editado_manualmente: true, // Para evitar que el useEffect del useGenerarDespiece nos borre la actualización
      cantidad_escuadras: cantidad_escuadras,
    }));
  };

  return (
    <div className="wizard-section">
      <h4 className="text-base font-semibold text-orange-700 mb-2">
        🛠️ Ajustar precio de las ESCUADRAS
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Aquí puedes editar el <strong>precio (S/)</strong> para cada tipo de ESCUADRA.
      </p>

      {escuadras.map((pieza) => {
        const tipo = pieza.descripcion?.match(/ESCUADRA DE ([\d.]+\s*x\s*[\d.]+m?)/i)?.[1] || "—";
        const precioLocal = preciosLocales[pieza.pieza_id] ?? "0.00";
        const subtotal = (parseFloat(precioLocal) * pieza.total).toFixed(2);

        return (
          <div key={pieza.pieza_id} className="mb-3">
            <label className="block font-medium text-sm text-gray-700 mb-1">
              ESCUADRA {tipo} — {pieza.total} unidades
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
                    ? parseFloat(precioLocal) * pieza.total
                    : parseFloat(precioLocal) * pieza.total
                )}</strong>
              </span>
            </div>
          </div>
        );
      })}

      <div className="wizard-section">
        <h4 className="text-base font-semibold text-blue-700 mb-2">
            🎯 Ajustar descuento para PLATAFORMAS
        </h4>
        <div className="flex items-center gap-3">
            <input
            type="number"
            value={descuentoPorcentaje}
            onChange={(e) => setDescuentoPorcentaje(e.target.value)}
            onBlur={() => aplicarDescuentoPlataformas(parseFloat(descuentoPorcentaje))}
            className="border p-2 rounded w-[100px]"
            min={0}
            max={100}
            />
            <span className="text-sm text-gray-600">%</span>
        </div>
        <p className="text-sm mt-2 text-gray-700">
            Subtotal original: <strong>S/ {formatear(totalOriginal)}</strong><br />
            Subtotal con descuento aplicado: <strong className="text-blue-800">S/ {formatear(totalActual)}</strong>
        </p>

        <p className="text-xs mt-1 text-gray-500">Este descuento se aplicará sobre todas las plataformas.</p>
      </div>

    </div>
  );
}