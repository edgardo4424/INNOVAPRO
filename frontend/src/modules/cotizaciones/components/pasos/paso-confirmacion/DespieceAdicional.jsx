import { useEffect, useState } from "react";
import api from "@/shared/services/api";
import useDespieceManual from "../../../hooks/useDespieceManual";

// Este componente permite al comercial agregar manualmente piezas adicionales al despiece generado automáticamente, 
// en caso de requerir piezas extras con cantidades personalizadas. Consulta las piezas disponibles desde la API, 
// permite buscarlas por código o descripción, ingresar cantidad y agregarlas al resumen general. 
// También permite eliminarlas dinámicamente y recalcula el resumen del despiece con cada cambio.

export default function DespieceAdicional({ formData, setFormData }) {

  // Estados donde guardamos lo que el usuario está haciendo
  const [piezasDisponibles, setPiezasDisponibles] = useState([]); // Para almacenar las piezas desde la API
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null); // Para almacenar la pieza que está buscando o eligiendo
  const [cantidad, setCantidad] = useState(""); // Para almacenar cuántas unidades desea agregar
  const [precioManual, setPrecioManual ] = useState(""); // Para almacenar el precio, que también puede ser manual

  // Almacenamos el tipo de cotización 
  // Ya que el precio base varía según si es Alquiler o Venta
  const tipoCotizacion = formData.cotizacion.tipo; 

  const {
    despieceManual,
    agregarPieza,
    eliminarPieza
  } = useDespieceManual({ 
    tipoCotizacion,
    formData,
    onResumenChange: ({ nuevoDespiece, resumen }) => {
      // Guardamos el despiece original para no perder las piezas que no son adicionales
      const despieceOriginal = formData.uso.despiece || [];

      // Actualizamos el formData con el nuevo despiece y resumen 
      // Marcamos las piezas nuevas con "esAdicional"
      const despieceFinal = [ 
        ...despieceOriginal.filter((p) => !p.esAdicional), //protegiendo todo el despiece original
        ...nuevoDespiece.map((p) => ({ //agregamos solo las piezas adicionales con su propiedad 'esAdicional'
          ...p,
          esAdicional: true
        }))
      ];

      // En base al despieceFinal recalculamos el resumen 

      const resumenFinal = {
        total_piezas: despieceFinal.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
        peso_total_kg: despieceFinal.reduce((acc, p) => acc + parseFloat(p.peso_kg || 0), 0).toFixed(2),
        peso_total_ton: (despieceFinal.reduce((acc, p) => acc + parseFloat(p.peso_kg || 0), 0) / 1000).toFixed(2),
        precio_subtotal_venta_soles: despieceFinal.reduce((acc, p) => acc + parseFloat(p.precio_venta_soles || 0), 0).toFixed(2),
        precio_subtotal_alquiler_soles: despieceFinal.reduce((acc, p) => acc + parseFloat(p.precio_alquiler_soles || 0), 0).toFixed(2),
        precio_subtotal_venta_dolares: 0
      };

      // Y guardamos en el formData tanto el despiece final como el resumen final
      setFormData((prev) => ({
        ...prev,
        uso: {
          ...prev.uso,
          despiece: despieceFinal,
          resumenDespiece: resumenFinal
        }
      }));
    }
  });

  // Al montar el componente solicitamos todas las piezas a la API del backend
  useEffect(() => {
    const cargarPiezas = async () => {
      try {
        const { data } = await api.get("/piezas");
        setPiezasDisponibles(data);
      } catch (error) {
        console.error("Error al cargar piezas", error);
      }
    };
    cargarPiezas();
  }, []);

  // Manejamos el agregar piezas con este handle
  const handleAgregar = () => {
    // Buscamos si la pieza que el usuario escribió, existe en nuestra lista de piezas
    const piezaEncontrada = piezasDisponibles.find(
      (p) =>
        `${p.item} - ${p.descripcion}`.toLowerCase() ===
        piezaSeleccionada?.busqueda?.toLowerCase()
    );

    // Si existe, verificamos si la cantidad es mayor a 0 
    if (piezaEncontrada && cantidad > 0) {
      // La agregamos con el método del hook useDespieceManual
      const exito = agregarPieza(piezaEncontrada, parseInt(cantidad), parseFloat(precioManual || 0));
      if (exito) {
        setCantidad("");
        setPiezaSeleccionada(null);
        setPrecioManual("");
      }
    }
  };

  const piezasVisuales = (formData.uso.despiece || []).filter(p => p.esAdicional);

  return (
    <div className="wizard-section">
      <h4 className="mb-2">➕ Agregar piezas adicionales al despiece</h4>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px]">
          <label>Buscar pieza:</label>
          <input
            type="text"
            placeholder="Ej: AM.0100 o Husillo"
            value={piezaSeleccionada?.busqueda || ""}
            onChange={(e) => {
              const texto = e.target.value;
              setPiezaSeleccionada({ busqueda: texto }); // solo texto por ahora

              if (texto.trim() === "") {
                setPrecioManual(""); // limpiamos el precio si se borra la busqueda
              }
            }}
            onBlur={(e) => {
              const texto = e.target.value.toUpperCase().trim();
              const pieza = piezasDisponibles.find(
                (p) =>
                  `${p.item} - ${p.descripcion}`.toUpperCase() === texto
              );
              if (pieza) {
                const precioBase = tipoCotizacion === "Alquiler"
                  ? pieza.precio_alquiler_soles
                  : pieza.precio_venta_soles;

                setPiezaSeleccionada({ ...pieza, busqueda: texto });
                setPrecioManual(parseFloat(precioBase || 0).toFixed(2));
              } 
            }}
            list="piezas-lista"
            className="input w-full"
          />
          <datalist id="piezas-lista">
            {piezasDisponibles.map((pieza) => (
              <option key={pieza.id} value={`${pieza.item} - ${pieza.descripcion}`} />
            ))}
          </datalist>
        </div>

        <div className="w-32">
          <label>Cantidad:</label>
          <input
            type="number"
            min="1"
            onWheel={(e) => e.target.blur()}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="w-44">
          <label>Precio unitario (S/):</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioManual}
            onChange={(e) => setPrecioManual(e.target.value)}
            onWheel={(e) => e.target.blur()}
            className="input w-full"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleAgregar}
            className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Agregar
          </button>
        </div>
      </div>

      {piezasVisuales.length > 0 && (
        <div className="mt-6">
          <h5 className="mb-2">Piezas adicionales:</h5>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-1 px-2">#</th>
                <th className="py-1 px-2">Descripción</th>
                <th className="py-1 px-2">Cantidad</th>
                <th className="py-1 px-2">Precio unitario</th>
                <th className="py-1 px-2">Subtotal</th>
                <th className="py-1 px-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {despieceManual.map((pieza, idx) => {
                console.log("Piezas", pieza, idx)
                const unitario = parseFloat(pieza.precio_unitario_alquiler || pieza.precio_unitario_venta || 0);
                const subtotal = (unitario * parseFloat(pieza.cantidad || 0)).toFixed(2);

                return (
                  <tr key={idx} className="border-t">
                    <td className="py-1 px-2">{idx + 1}</td>
                    <td className="py-1 px-2">{pieza.descripcion}</td>
                    <td className="py-1 px-2">{pieza.cantidad}</td>
                    <td className="py-1 px-2">S/ {unitario.toFixed(2)}</td>
                    <td className="py-1 px-2">S/ {subtotal}</td>
                    <td className="py-1 px-2 text-center">
                      <button
                        onClick={() => eliminarPieza(pieza.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}