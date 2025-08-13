import { useState } from "react";

// Este componente maneja la lógica para el uso de Plataforma de Descarga
// Permite al usuario editar el precio manualmente para cada tipo de plataforma de descarga encontrada en el despiece

export default function BloquePlataformaDescarga({ formData, setFormData }) {

  // Detectamos que tipo de cotización es, puede ser Alquiler o Venta
  const tipo_cotizacion = formData.cotizacion.tipo;
  
  // Función para mostrar un guión si el precio viene como NaN
  const formatear = (n) => isNaN(n) ? "—" : n.toFixed(2);
  
  // Detectamos las plataformas que vienen en el despiece
  const plataformas = formData.uso.despiece.filter(p =>
    p.descripcion?.toUpperCase().includes("PLATAFORMA DE DESCARGA")
  );

  // Si no encontramos, no mostramos nada
  if (plataformas.length === 0) return null;

  // Preparamos los precios iniciales y contamos cuántas plataformas hay
  const initialPrecios = {};
  let cantidad_plataformas = 0;

  for (const p of plataformas) {
    let base;
    if (tipo_cotizacion === "Alquiler") {
      base = p.precio_manual ?? p.precio_u_alquiler_soles;
    } else {
      base = p.precio_venta_manual ?? p.precio_u_venta_soles;
    }

    initialPrecios[p.pieza_id] = base.toFixed(2) ?? "0.00";
    cantidad_plataformas += p.total;
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
        cantidad_plataformas: cantidad_plataformas,
      }
    }));
  };

  return (
    <div className="wizard-section">
      <h4 className="text-base font-semibold text-orange-700 mb-2">
        🛠️ Ajustar precio de las PLATAFORMAS DE DESCARGA
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Aquí puedes editar el <strong>precio (S/)</strong> para cada tipo de PLATAFORMA.
      </p>

      {plataformas.map((pieza) => {
        // Extraemos el tipo de plataforma de la descripción
        // "PLATAFORMA DE DESCARGA - 2.0 TON" -> extrae "2.0 TON"
        // "PLATAFORMA DE DESCARGA 1.5T" -> extrae "1.5T"
        const tipo = pieza.descripcion?.match(/PLATAFORMA DE DESCARGA\s*[-–]?\s*(\d+(?:\.\d+)?\s*\w+)/i)?.[1] || "—";

        // Almacenamos el precio base si existe, sino mostramos "0.00"
        const precioLocal = preciosLocales[pieza.pieza_id] ?? "0.00";

        // Almacenamos la multiplicación de la cantidad * el precio local y lo redondeamos a dos decimales
        const subtotal = (parseFloat(precioLocal) * pieza.total).toFixed(2);

        return ( // Bloques por cada plataforma
          <div key={pieza.pieza_id} className="mb-3"> 
            <label className="block font-medium text-sm text-gray-700 mb-1">
              PLATAFORMA DE DESCARGA {tipo} — {pieza.total} unidades
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
    </div>
  );
}