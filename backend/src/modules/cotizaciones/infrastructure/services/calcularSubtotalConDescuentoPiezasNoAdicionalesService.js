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
      if (uso_id == "3") { // ESCALERA DE ACCESO

        // Solo para escalera de acceso, El subtotal no se calcular en base a las piezas, sino en base a numero de tramos
        // El precio del tramo se mandara desde el front

        const { detalles_escaleras } = cotizacion;
        const numero_tramos = Number(detalles_escaleras?.tramos_2m || 0) + Number(detalles_escaleras?.tramos_1m || 0)
        subtotal = (Number(numero_tramos) * Number(detalles_escaleras?.precio_por_tramo_alquiler));

      } else {
        subtotal = despiecePiezasNoAdicionales.reduce(
          (acc, p) => acc + (Number(p?.precio_alquiler_soles || 0)),
          0
        );

      }
      moneda = "PEN";
      break;
    case "Venta":
      subtotal = despiecePiezasNoAdicionales.reduce(
          (acc, p) => acc + (Number(p?.precio_venta_soles || 0)),
          0
        );
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
