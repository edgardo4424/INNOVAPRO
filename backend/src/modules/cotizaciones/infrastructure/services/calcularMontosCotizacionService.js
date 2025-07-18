function calcularMontosCotizacion({
  despiece,
  tipoCotizacion,
  cotizacion,
  uso_id,
}) {
  console.log({
    despiece,
    tipoCotizacion,
    cotizacion,
  });
  const igvPorcentaje = parseFloat(cotizacion.igv_porcentaje ?? 0) || 0;
  const porcentajeDescuento =
    parseFloat(cotizacion.porcentaje_descuento ?? 0) || 0;

  let subtotal = 0;
  let moneda = "";

  switch (tipoCotizacion) {
    case "Alquiler":
      // ESCALERA DE ACCESO
      if (uso_id == "3") {
        // ESCALERA DE ACCESO

        // Solo para escalera de acceso, El subtotal no se calcular en base a las piezas, sino en base a numero de tramos
        // El precio del tramo se mandara desde el front

        const { detalles_escaleras } = cotizacion;
        const numero_tramos =
          Number(detalles_escaleras?.tramos_2m || 0) +
          Number(detalles_escaleras?.tramos_1m || 0);
        let subtotal_1 =
          Number(numero_tramos) *
          Number(detalles_escaleras?.precio_por_tramo_alquiler);

        // Añadir los precios de las piezas adicionales
        const piezas_adicionales = despiece.filter((p) => p?.esAdicional);
        let subtotal_2 = 0;

        console.log("piezas_adicionales", piezas_adicionales);

        subtotal_2 = piezas_adicionales.reduce(
          (acc, p) =>
            acc + p.total * parseFloat(p.precio_u_alquiler_soles || 0),
          0
        );

        subtotal = subtotal_1 + subtotal_2;
        
      } else if (uso_id == "8") {
        // COLGANTE

        // Solo para escalera de acceso, El subtotal no se calcular en base a las piezas, sino en base a numero de tramos
        // El precio del tramo se mandara desde el front

        const { detalles_colgantes } = cotizacion;

        let subtotal_1 =
          Number(detalles_colgantes?.cantidad_colgantes) *
          Number(detalles_colgantes?.precio_u_alquiler_soles);

        // Añadir los precios de las piezas adicionales
        const piezas_adicionales = despiece.filter((p) => p?.esAdicional);
        let subtotal_2 = 0;

        subtotal_2 = piezas_adicionales.reduce(
          (acc, p) =>
            acc + p.total * parseFloat(p.precio_u_alquiler_soles || 0),
          0
        );

        subtotal = subtotal_1 + subtotal_2;
       
      } else {
        subtotal = despiece.reduce(
          (acc, p) =>
            acc + p.total * parseFloat(p.precio_u_alquiler_soles || 0),
          0
        );
      }
      moneda = "PEN";
      break;
    case "Venta":
      // Colgante
      if (uso_id == "8") {
        const { detalles_colgantes } = cotizacion;

        subtotal = Number(detalles_colgantes?.cantidad_colgantes) *
          Number(detalles_colgantes?.precio_u_venta_soles);


      } else {
        subtotal = despiece.reduce(
          (acc, p) => acc + p.total * parseFloat(p.precio_u_venta_soles || 0),
          0
        );
      }

      moneda = "PEN";
      break;
  }

  const subtotalConDescuento = parseFloat(
    ((100 - porcentajeDescuento) * subtotal * 0.01).toFixed(2)
  );
  const igvMonto = parseFloat(
    (subtotalConDescuento * igvPorcentaje * 0.01).toFixed(2)
  );
  const total = subtotalConDescuento + igvMonto;

  return {
    dataParaGuardarDespiece: {
      moneda,
      subtotal: subtotal.toFixed(2),
      porcentaje_descuento: porcentajeDescuento,
      subtotal_con_descuento: subtotalConDescuento,
      igv_porcentaje: igvPorcentaje,
      igv_monto: igvMonto,
      total_final: total.toFixed(2),
    },
  };
}

module.exports = { calcularMontosCotizacion };
