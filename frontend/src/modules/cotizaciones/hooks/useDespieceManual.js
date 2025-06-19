import { useState, useEffect } from "react";

export default function useDespieceManual({ tipoCotizacion, formData, onResumenChange }) {
  const [despieceManual, setDespieceManual] = useState([]);

  useEffect(() => {
    if (typeof onResumenChange === "function") {
      const resumen = calcularResumen(despieceManual);
      const nuevoDespiece = formatearDespiece(despieceManual);

      onResumenChange({ nuevoDespiece, resumen });
    }
  }, [despieceManual]);

  const agregarPieza = (pieza, cantidad) => {
    const yaExiste = despieceManual.find(p => p.id === pieza.id);
    if (yaExiste) return false;

    const pesoTotal = parseFloat(pieza.peso_kg) * cantidad;

    const nueva = {
      ...pieza,
      cantidad,
      descripcion: `${pieza.item} - ${pieza.descripcion}`,
      subtotal_alquiler: (parseFloat(pieza.precio_alquiler_soles) * cantidad).toFixed(2),
      subtotal_venta: (parseFloat(pieza.precio_venta_soles) * cantidad).toFixed(2),
      peso_kg_total: pesoTotal
    };

    setDespieceManual(prev => [...prev, nueva]);
    return true;
  };

  const eliminarPieza = (piezaId) => {
    const nuevaLista = despieceManual.filter(p => p.id !== piezaId);
    setDespieceManual(nuevaLista);

    const despieceFiltrado = formData.despiece?.filter(p => p.id !== piezaId);
    const resumen = calcularResumen(despieceFiltrado);

    onResumenChange({
        nuevoDespiece: nuevaLista,
        resumen,
    });
    };


  const calcularResumen = (piezas) => {
    const total_piezas = piezas.reduce((acc, p) => acc + p.cantidad, 0);
    const peso_total_kg = piezas.reduce((acc, p) => acc + p.peso_kg_total, 0);
    const peso_total_ton = (peso_total_kg / 1000).toFixed(2);
    const precio_subtotal_venta_soles = piezas.reduce((acc, p) => acc + (p.precio_unitario_venta * p.cantidad), 0).toFixed(2);
    const precio_subtotal_alquiler_soles = piezas.reduce((acc, p) => acc + (p.precio_unitario_alquiler * p.cantidad), 0).toFixed(2);

    return {
      total_piezas,
      peso_total_kg: peso_total_kg.toFixed(2),
      peso_total_ton,
      precio_subtotal_venta_dolares: 0,
      precio_subtotal_venta_soles,
      precio_subtotal_alquiler_soles
    };
  };

  const formatearDespiece = (piezas) => {
  return piezas.map(p => {
        return {
        pieza_id: p.id,
        item: p.item,
        descripcion: p.descripcion,
        total: p.cantidad,
        peso_u_kg: parseFloat(p.peso_kg).toFixed(2),
        peso_kg: p.peso_kg_total,
        precio_u_venta_dolares: parseFloat(p.precio_venta_dolares).toFixed(2),
        precio_venta_dolares: (parseFloat(p.precio_venta_dolares) * p.cantidad).toFixed(2),
        precio_u_venta_soles: parseFloat(p.precio_venta_soles).toFixed(2),
        precio_venta_soles: (parseFloat(p.precio_venta_soles) * p.cantidad).toFixed(2),
        precio_u_alquiler_soles: parseFloat(p.precio_alquiler_soles).toFixed(2),
        precio_alquiler_soles: (parseFloat(p.precio_alquiler_soles) * p.cantidad).toFixed(2),
        stock_actual: p.stock_actual || 0,
        };
    });
    };


  return {
    despieceManual,
    agregarPieza,
    eliminarPieza,
    calcularResumen,
    formatearDespiece,
    setDespieceManual
  };
}