import { useState } from "react";

// Este bloque le permite al comercial ajustar manualmente los precios de las Escuadras y
// aplicar descuentos masivos sobre las plataformas

export default function BloqueEscuadras({ formData, setFormData }) {
  // Guardamos el tipo de cotización que puede ser Alquiler o Venta
  const tipo_cotizacion = formData.cotizacion.tipo;
  
  // Función para formatear números con guiones si llega como NaN
  const formatear = (n) => isNaN(n) ? "—" : n.toFixed(2);
  
  // Filtramos las escuadras del despiece
  const escuadras = formData.uso.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("ESCUADRA")
  );

  // Filtramos las plataformas del despiece
  const plataformas = formData.uso.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("PLATAFORMA")
  );

  // Si no hay escuadras ni plataformas, no hacemos nada
  if (escuadras.length === 0 && plataformas.length === 0) return null;

  // Estado que almacenará el descuento para las plataformas
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const totalPlataformasOriginal = plataformas.reduce((acc, p) =>
    acc + parseFloat(p.precio_venta_soles || 0), 0
  );

  const totalConDescuento = parseFloat(
    (totalPlataformasOriginal * (1 - descuentoPorcentaje / 100)).toFixed(2)
  );

  const aplicarDescuento = () => {
    if (tipo_cotizacion !== "Venta") return;

    const plataformasConDescuento = plataformas.map(p => {
      const subtotalOriginal = parseFloat(p.precio_venta_soles || 0);
      const nuevoSubtotal = parseFloat((subtotalOriginal * (1 - descuentoPorcentaje / 100)).toFixed(2));

      return {
        ...p,
        precio_venta_soles: nuevoSubtotal,
        descuento_aplicado: descuentoPorcentaje,
      };
    });

    const nuevoDespiece = formData.uso.despiece.map(p =>
      p.descripcion?.toUpperCase().includes("PLATAFORMA")
        ? plataformasConDescuento.find(pl => pl.pieza_id === p.pieza_id) || p
        : p
    );

    const resumenActualizado = recalcularResumen(nuevoDespiece);

    setFormData(prev => ({
      ...prev,
      uso: {
        ...prev.uso,
        despiece: nuevoDespiece,
        resumenDespiece: resumenActualizado,
        descuento_plataformas: descuentoPorcentaje,
        despiece_editado_manualmente: true,
      }
    }));
  };

  const recalcularResumen = (despiece) => {
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
      precio_subtotal_alquiler_soles: subtotal_alquiler.toFixed(2),
    };
  };

  // Guardamos el subtotal de todas las plataformas para mostrar la diferencia 
  // entre el precio original y el que el comercial ha modificado si aplica descuento
  const totalOriginal = plataformas.reduce((acc, p) => {
    const precioOriginal = p.precio_original_alquiler_soles || parseFloat(p.precio_u_alquiler_soles || 0);
    return acc + (precioOriginal * p.total);
  }, 0);

  const totalActual = plataformas.reduce((acc, p) => {
    return acc + parseFloat(p.precio_alquiler_soles || p.precio_venta_soles || 0);
  }, 0);

  // Función para aplicar el descuento a todas las plataformas
  const aplicarDescuentoPlataformas = (porcentaje) => {
    // Validamos que el número del porcentaje sea válido
    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) return;

    const factor = 1 - porcentaje / 100;

    // Actualizamos el despiece aplicando el factor a todas las piezas que sean plataformas
    const despieceActualizado = formData.uso.despiece.map(p => {
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
    
    // Calculamos el resumen con el despiece actualizado
    const nuevoResumen = calcularResumen(despieceActualizado);

    // Seteamos el formData global con los nuevos cambios 
    // indicando que el despiece ha sido editado manualmente
    setFormData(prev => ({
        ...prev,
        uso: {
          ...prev.uso,
          despiece: despieceActualizado,
          resumenDespiece: nuevoResumen,
          descuento_plataformas: porcentaje,
          despiece_editado_manualmente: true
        }
    }))
  }

  // Preparamos los precios iniciales y contamos cuántas escuadras hay
  const initialPrecios = {};
  let cantidad_escuadras = 0;

  for (const p of escuadras) {
    let base;
    if (tipo_cotizacion === "Alquiler") {
      base = p.precio_manual ?? p.precio_u_alquiler_soles;
    } else {
      base = p.precio_venta_manual ?? p.precio_u_venta_soles;
    }
    initialPrecios[p.pieza_id] = base.toFixed(2) ?? "0.00";
    cantidad_escuadras += p.total;
  }

  // Guardamos el valor inicial en un estado local para trabajar con el
  const [preciosLocales, setPreciosLocales] = useState(initialPrecios);

  // Función para calcular el resumen si cambiamos el despiece
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

  // Función para manejar el cambio del precio manual cuando el usuario salga del input
  const handleBlur = (pieza, precioStr) => {
    const valor = parseFloat(precioStr);
    // Si el valor del precio de la pieza es invalido, retornamos
    if (isNaN(valor)) return;

    // Actualizamos el despiece dependiendo el tipo de cotización
    // con el valor del precio ingresado por el usuario
    const despieceActualizado = formData.uso.despiece.map(p => {
      if (p.pieza_id === pieza.pieza_id) {     
        if (tipo_cotizacion === "Alquiler") {
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

    // Calculamos el resumen con el despiece actualizado
    const nuevoResumen = calcularResumen(despieceActualizado);

    // Guardamos todo en el formData indicando que el despiece fue editado manualmente
    // para evitar que el useEffect del useGenerarDespiece nos borre la actualización que hicimos manualmente
    setFormData(prev => ({
      ...prev,
      uso: {
        ...prev.uso,
        despiece: despieceActualizado,
        resumenDespiece: nuevoResumen,
        despiece_editado_manualmente: true,
        cantidad_escuadras: cantidad_escuadras,
      }
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
        // Extraemos el tipo de escuadra de la descripción
        // "ESCUADRA 3x2" -> extrae "3x2"
        // "ESCUADRA 1x2 -> extrae "1x2"
        const tipo = pieza.descripcion?.match(/ESCUADRA DE ([\d.]+\s*x\s*[\d.]+m?)/i)?.[1] || "—";

        // Almacenamos el precio base si existe, sino mostramos "0.00"
        const precioLocal = preciosLocales[pieza.pieza_id] ?? "0.00";

        // Almacenamos la multiplicación de la cantidad * el precio local y lo redondeamos a dos decimales
        const subtotal = (parseFloat(precioLocal) * pieza.total).toFixed(2);

        return (  // Bloques por cada tipo de escuadra
          <div key={pieza.pieza_id} className="mb-3">
            <label className="block font-medium text-sm text-gray-700 mb-1">
              ESCUADRA {tipo} — {pieza.total} unidades
            </label>
            <div className="flex items-center gap-3">
              {/* Cada ves que el usuario modifica el precio, actualizamos el estado del precio local 
                  Cuando deja de escribir y sale del input aplicamos el cambio en el formData global */}
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
                S/ unitario
              </span>

              <span className="ml-auto text-sm text-blue-900">
                Subtotal: <strong>S/{formatear( parseFloat(precioLocal) * pieza.total)}</strong>
              </span>
            </div>
          </div>
        );
      })}

      {tipo_cotizacion === "Venta" && plataformas.length > 0 && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descuento aplicado a plataformas de venta (%)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min={0}
              max={100}
              className="border p-2 rounded w-[100px]"
              value={descuentoPorcentaje}
              onChange={(e) => setDescuentoPorcentaje(e.target.value)}
              onBlur={aplicarDescuento}
            />
            <span className="text-sm text-gray-600">%</span>
          </div>

          <p className="text-sm text-gray-700">
            Total original: <strong>S/ {formatear(totalPlataformasOriginal)}</strong><br />
            Total con descuento: <strong className="text-blue-800">S/ {formatear(totalConDescuento)}</strong>
          </p>
        </>
      )}

      {(plataformas.length > 0) && tipo_cotizacion === "Alquiler" && ( // Bloques para las plataformas
        <div className="wizard-section">
          <h4 className="text-base font-semibold text-blue-700 mb-2">
              🎯 Ajustar descuento para PLATAFORMAS
          </h4>
          <div className="flex items-center gap-3">
              {/* Cada ves que el usuario modifica el precio, actualizamos el estado del precio local 
                  Cuando deja de escribir y sale del input aplicamos el cambio en el formData global */}
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
      )}

    </div>
  );
}