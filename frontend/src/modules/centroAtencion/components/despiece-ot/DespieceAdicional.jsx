import { useEffect, useState } from "react";
import api from "@/shared/services/api";
import useDespieceManualOT from "../../hooks/useDespieceManualOT";

// Este componente permite al comercial agregar manualmente piezas adicionales al despiece generado automáticamente, 
// en caso de requerir piezas extras con cantidades personalizadas. Consulta las piezas disponibles desde la API, 
// permite buscarlas por código o descripción, ingresar cantidad y agregarlas al resumen general. 
// También permite eliminarlas dinámicamente y recalcula el resumen del despiece con cada cambio.

export default function DespieceAdicional({ formData, setFormData }) {

  // En éstos estados del componente manejamos las piezas de la API, las pieza que escribe el comercial y la cantidad.
  const [piezasDisponibles, setPiezasDisponibles] = useState([]);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState("");

  const {
    despieceManual,
    agregarPieza,
    eliminarPieza
  } = useDespieceManualOT({
    tipoCotizacion: formData.tipo_cotizacion,
    formData,
    onResumenChange: ({ nuevoDespiece, resumen }) => {
      const despieceOriginal = formData.despiece || [];

      const despieceFinal = [ // Reconstruímos el despiece
        ...despieceOriginal.filter((p) => !p.esAdicional), //protegiendo todo el despiece original
        ...nuevoDespiece.map((p) => ({ //agregamos solo las piezas adicionales con su propiedad 'esAdicional'
          ...p,
          esAdicional: true
        }))
      ];

      const resumenFinal = {
        total_piezas: despieceFinal.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0),
        peso_total_kg: despieceFinal.reduce((acc, p) => acc + parseFloat(p.peso_kg || 0), 0).toFixed(2),
        peso_total_ton: (despieceFinal.reduce((acc, p) => acc + parseFloat(p.peso_kg || 0), 0) / 1000).toFixed(2),
        precio_subtotal_venta_soles: despieceFinal.reduce((acc, p) => acc + parseFloat(p.precio_venta_soles || 0), 0).toFixed(2),
        precio_subtotal_alquiler_soles: despieceFinal.reduce((acc, p) => acc + parseFloat(p.precio_alquiler_soles || 0), 0).toFixed(2),
        precio_subtotal_venta_dolares: 0
      };

      setFormData((prev) => ({
        ...prev,
        despiece: despieceFinal,
        resumenDespiece: resumenFinal
      }));
    }
  });

  // Carga inicial de piezas desde la API

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

  // Lógica para agregar cada pieza: validamos si existe y hay una cantidad válida.
  // Luego la agregamos con el helper del hook DespieceManual

  const handleAgregar = () => {
    const piezaEncontrada = piezasDisponibles.find(
      (p) =>
        `${p.item} - ${p.descripcion}`.toLowerCase() ===
        piezaSeleccionada?.busqueda?.toLowerCase()
    );
    if (piezaEncontrada && cantidad > 0) {
      const éxito = agregarPieza(piezaEncontrada, parseInt(cantidad));
      if (éxito) {
        setCantidad("");
        setPiezaSeleccionada(null);
      }
    }
  };

  const piezasVisuales = (formData.despiece || []).filter(p => p.esAdicional);

  return (
    <div className="wizard-section">
      <h4 style={{ marginBottom: "0.5rem" }}>➕ Agregar piezas adicionales al despiece</h4>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "2 1 300px" }}>
          <label>Buscar pieza:</label>
          <input
            type="text"
            placeholder="Ej: AM.0100 o Husillo"
            value={piezaSeleccionada?.busqueda || ""}
            onChange={(e) => {
              const texto = e.target.value.toLowerCase();
              const pieza = piezasDisponibles.find(
                (p) =>
                  p.item.toLowerCase().includes(texto) ||
                  p.descripcion.toLowerCase().includes(texto)
              );
              if (pieza) {
                setPiezaSeleccionada({ ...pieza, busqueda: e.target.value });
              } else {
                setPiezaSeleccionada({ busqueda: e.target.value });
              }
            }}
            list="piezas-lista"
            style={{ width: "100%" }}
          />
          <datalist id="piezas-lista">
            {piezasDisponibles.map((pieza) => (
              <option key={pieza.id} value={`${pieza.item} - ${pieza.descripcion}`} />
            ))}
          </datalist>
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <label>Cantidad:</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <button type="button" onClick={handleAgregar}>
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
                    alignItems: "center"
                }}
                >
                <span>
                    <strong>{idx + 1}.</strong> {pieza.descripcion} — <strong>{pieza.cantidad}</strong> unidades
                </span>
                <button
                    onClick={() => eliminarPieza(pieza.pieza_id)}
                    style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.2rem 0.5rem",
                    cursor: "pointer"
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