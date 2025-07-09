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

        console.log('piezas_adicionales', piezas_adicionales);

        subtotal_2 = piezas_adicionales.reduce(
          (acc, p) => acc + p.total * parseFloat(p.precio_u_alquiler_soles || 0),
          0
        );

        subtotal = subtotal_1 + subtotal_2
        console.log('SUBTOTALLLLLL', subtotal);
      } else {
        subtotal = despiece.reduce(
          (acc, p) =>
            acc + p.total * parseFloat(p.precio_u_alquiler_soles || 0),
          0
        );

        console.log("subtotal", subtotal);
      }
      moneda = "PEN";
      break;
    case "Venta":
      subtotal = despiece.reduce(
        (acc, p) => acc + p.total * parseFloat(p.precio_u_venta_soles || 0),
        0
      );
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
