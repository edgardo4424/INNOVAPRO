import { useState, useEffect } from "react";

// Hook personalizado que maneja la lógica para agregar/eliminar piezas a un despiece.

export default function useDespieceManual({ tipoCotizacion, formData, onResumenChange }) {

  // Almacenamos las piezas seleccionadas por el usuario
  const [despieceManual, setDespieceManual] = useState([]); 

  // Actualizamos automáticamente cada vez que cambia el despieceManual
  // Calculamos el resumen y formateamos el despiece
  useEffect(() => { 
    if (typeof onResumenChange === "function") {

      const resumen = calcularResumen(despieceManual);
      const nuevoDespiece = formatearDespiece(despieceManual);

      onResumenChange({ nuevoDespiece, resumen });
    }
  }, [despieceManual]);

  // Método para agregar una pieza nueva al despiece
  // Recibe tres parámetros: la pieza, la cantidad de piezas y el precio unitario de cada pieza

  const agregarPieza = (pieza, cantidad, precioManual) => {

    // Verificamos si la pieza ya existe en el despiece manual
    const yaExiste = despieceManual.find(p => p.id === pieza.id); 

    // Si ya existe, no la agregamos de nuevo
    if (yaExiste) return false; 

    // Calculamos el peso total de la pieza en base a la cantidad
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


    // Dependiendo del tipo de cotización elegimos como calcular el precio
    // Usamos el precio manual si se proporcionó, sino el de base
    if (esAlquiler) {
      const precioManualAlquiler = parseFloat(precioManual || pieza.precio_alquiler_soles);
      precioUnitario = precioManualAlquiler;
      subtotal = precioUnitario * cantidad;

      nueva.precio_unitario_alquiler = precioUnitario;
      nueva.subtotal_alquiler = subtotal.toFixed(2);
      nueva.precio_alquiler_soles = precioUnitario;
      nueva.precio_manual_alquiler = precioManual ? parseFloat(precioManual) : null;

    } else { // En caso sea Venta
      // Si es venta, usamos el precio de venta manual o el de base
      const precioManualVenta = parseFloat(precioManual || pieza.precio_venta_soles);
      precioUnitario = precioManualVenta;
      subtotal = precioUnitario * cantidad;

      nueva.precio_unitario_venta = precioUnitario;
      nueva.subtotal_venta = subtotal.toFixed(2);
      nueva.precio_venta_soles = precioUnitario;
      nueva.precio_manual_venta = precioManual ? parseFloat(precioManual) : null;
    }
    
    // Guardamos la pieza en el despiece manual
    setDespieceManual(prev => [...prev, nueva]);

    return true; // Retornamos true para indicar que se agregó correctamente

  };

  // Método para eliminar una pieza del despiece manual
  // Recibe el ID de la pieza a eliminar
  const eliminarPieza = (piezaId) => {

    // Filtramos el despiece manual para sacar la pieza con el ID proporcionado
    const nuevaLista = despieceManual.filter(p => p.id !== piezaId); 

    // Actualizamos el estado de piezas manuales con la nueva lista sin la pieza eliminada
    setDespieceManual(nuevaLista);

    const despieceFiltrado = formData.uso.despiece?.filter(p => p.id !== piezaId);

    //Acá filtramos el despiece para eliminar cualquier pieza con ese id
    // Calculamos el resumen con el despiece filtrado
    const resumen = calcularResumen(despieceFiltrado); 

    onResumenChange({
        nuevoDespiece: nuevaLista,
        resumen,
    });
  };

  // Método para calcular el resumen del despiece manual
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

  // Formateamos las piezas con la estructura exacta 
  // que el backend necesita para la tabla despieces_detalle
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

  // Retornamos los métodos y el estado necesario para el despiece manual
  // para que puedan ser usados en los componentes que lo necesiten
  return {
    despieceManual,
    agregarPieza,
    eliminarPieza,
    calcularResumen,
    formatearDespiece,
    setDespieceManual
  };
}