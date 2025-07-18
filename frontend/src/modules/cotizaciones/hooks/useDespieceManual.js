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

  const agregarPieza = (pieza, cantidad, precioManual) => {
    const yaExiste = despieceManual.find(p => p.id === pieza.id);
    if (yaExiste) return false;

    const pesoTotal = parseFloat(pieza.peso_kg) * cantidad;

    const esAlquiler = tipoCotizacion === "Alquiler";

    let precioUnitario;
    let subtotal;
    let nueva = {
      ...pieza,
      cantidad,
      descripcion: `${pieza.descripcion}`,
      peso_kg_total: pesoTotal,
      esAdicional: true,
    };

    // Usamos manual si se proporcionó, sino el de base
    if (esAlquiler) {
      const precioManualAlquiler = parseFloat(precioManual || pieza.precio_alquiler_soles);
      precioUnitario = precioManualAlquiler;
      subtotal = precioUnitario * cantidad;

      nueva.precio_unitario_alquiler = precioUnitario;
      nueva.subtotal_alquiler = subtotal.toFixed(2);
      nueva.precio_alquiler_soles = precioUnitario;
      nueva.precio_manual_alquiler = precioManual ? parseFloat(precioManual) : null;

    } else {
      const precioManualVenta = parseFloat(precioManual || pieza.precio_venta_soles);
      precioUnitario = precioManualVenta;
      subtotal = precioUnitario * cantidad;

      nueva.precio_unitario_venta = precioUnitario;
      nueva.subtotal_venta = subtotal.toFixed(2);
      nueva.precio_venta_soles = precioUnitario;
      nueva.precio_manual_venta = precioManual ? parseFloat(precioManual) : null;
    }

    setDespieceManual(prev => [...prev, nueva]);
    return true;

  };

  const eliminarPieza = (piezaId) => {
    const nuevaLista = despieceManual.filter(p => p.id !== piezaId); 
    setDespieceManual(nuevaLista); // Acá vamos a ir guardando las piezas adicionales que nosotros ingresamos

    const despieceFiltrado = formData.despiece?.filter(p => p.id !== piezaId);
    const resumen = calcularResumen(despieceFiltrado); //Acá filtramos el despiece para eliminar cualquier pieza con ese id

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