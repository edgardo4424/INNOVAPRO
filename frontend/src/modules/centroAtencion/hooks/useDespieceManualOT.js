import { useState, useEffect } from "react";

export function calcularResumen(piezas) {
  const total_piezas = piezas.reduce((acc, p) => acc + Number(p.cantidad), 0);
  const peso_total_kg = piezas.reduce((acc, p) => acc + Number(p.peso_kg), 0);
  const peso_total_ton = (peso_total_kg / 1000).toFixed(2);
  const precio_subtotal_venta_soles = piezas.reduce((acc, p) => acc + Number(p.precio_venta_soles), 0).toFixed(2);
  const precio_subtotal_alquiler_soles = piezas.reduce((acc, p) => acc + Number(p.precio_alquiler_soles), 0).toFixed(2);

  return {
    total_piezas,
    peso_total_kg: peso_total_kg.toFixed(2),
    peso_total_ton,
    precio_subtotal_venta_soles,
    precio_subtotal_alquiler_soles
  };
}

export default function useDespieceManualOT({ tipoCotizacion, onResumenChange }) {
  const [despieceManual, setDespieceManual] = useState([]);

  useEffect(() => {
    if (typeof onResumenChange === "function") {
      const resumen = calcularResumen(despieceManual);
      onResumenChange({ resumen, nuevoDespiece: despieceManual });
    }
  }, [despieceManual]);

  const agregarPieza = (pieza, cantidad) => {
    const yaExiste = despieceManual.find(p => p.pieza_id === pieza.id);
    if (yaExiste) return false;

    const pesoTotal = parseFloat(pieza.peso_kg) * cantidad;

    const nueva = {
      pieza_id: pieza.id,
      descripcion: pieza.descripcion,
      cantidad,
      peso_kg: pesoTotal.toFixed(2),
      precio_venta_dolares: (parseFloat(pieza.precio_venta_dolares) * cantidad).toFixed(2),
      precio_venta_soles: (parseFloat(pieza.precio_venta_soles) * cantidad).toFixed(2),
      precio_alquiler_soles: (parseFloat(pieza.precio_alquiler_soles) * cantidad).toFixed(2),
      precio_unitario:
        tipoCotizacion === "Venta"
        ? parseFloat(pieza.precio_venta_soles)
        : parseFloat(pieza.precio_alquiler_soles),
      subtotal:
        tipoCotizacion === "Venta"
        ? (parseFloat(pieza.precio_venta_soles) * cantidad).toFixed(2)
        : (parseFloat(pieza.precio_alquiler_soles) * cantidad).toFixed(2),
    };

    setDespieceManual(prev => [...prev, nueva]);
    return true;
  };

  const actualizarPieza = (id, campo, valor) => {
    setDespiece((prev) =>
        prev.map((p) =>
        p.id === id ? { ...p, [campo]: valor } : p
        )
    );
    };

  const eliminarPieza = (piezaId) => {
    const nuevaLista = despieceManual.filter(p => p.pieza_id !== piezaId);
    setDespieceManual(nuevaLista);

    const resumen = calcularResumen(nuevaLista);
    onResumenChange({ resumen, nuevoDespiece: nuevaLista });
  };

  return {
    despieceManual,
    agregarPieza,
    eliminarPieza,
    calcularResumen,
    setDespieceManual
  };
}