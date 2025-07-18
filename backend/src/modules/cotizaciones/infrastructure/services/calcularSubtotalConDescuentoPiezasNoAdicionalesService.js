function calcularSubtotalConDescuentoPiezasNoAdicionales({
  despiecePiezasNoAdicionales,
  tipoCotizacion,
  cotizacion,
  uso_id,
}) {
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

        const { detalles_opcionales } = cotizacion;
        const numero_tramos =
          Number(detalles_opcionales?.tramos_2m || 0) +
          Number(detalles_opcionales?.tramos_1m || 0);
        subtotal =
          Number(numero_tramos) *
          Number(detalles_opcionales?.precio_por_tramo_alquiler);
        console.log("SUBTOTAAAAAAAAAAL", subtotal);
      } else if (uso_id == "8") {
        // COLGANTE
        const { detalles_opcionales } = cotizacion;
        subtotal =
          Number(detalles_opcionales?.cantidad_colgantes) *
          Number(detalles_opcionales?.precio_u_alquiler_soles);
      } else {
        subtotal = despiecePiezasNoAdicionales.reduce(
          (acc, p) => acc + Number(p?.precio_alquiler_soles || 0),
          0
        );
      }
      moneda = "PEN";
      break;
    case "Venta":
      // Colgante
      if (uso_id == "8") {
        const { detalles_opcionales } = cotizacion;

        subtotal =
          Number(detalles_opcionales?.cantidad_colgantes) *
          Number(detalles_opcionales?.precio_u_venta_soles);
      } else {
        subtotal = despiecePiezasNoAdicionales.reduce(
          (acc, p) => acc + Number(p?.precio_venta_soles || 0),
          0
        );
      }

      moneda = "PEN";
      break;
  }

  const subtotalConDescuento = parseFloat(
    ((100 - porcentajeDescuento) * subtotal * 0.01).toFixed(2)
  );

  return {
    subtotal_piezas_no_adicionales_con_descuento_sin_igv: subtotalConDescuento,
  };
}

module.exports = { calcularSubtotalConDescuentoPiezasNoAdicionales };
