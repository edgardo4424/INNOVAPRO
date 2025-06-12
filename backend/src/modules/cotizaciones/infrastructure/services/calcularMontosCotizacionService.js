function calcularMontosCotizacion({
  despiece,
  tipoCotizacion,
  cotizacion,
  uso_id,
  atributos_formulario
}) {
  const igvPorcentaje = parseFloat(cotizacion.igv_porcentaje ?? 0) || 0;
  const porcentajeDescuento =
    parseFloat(cotizacion.porcentaje_descuento ?? 0) || 0;

  let subtotal = 0;
  let moneda = "";

  switch (tipoCotizacion) {

    case "Alquiler":
      if (uso_id == "3") { // ESCALERA DE ACCESO

        // Solo para escalera de acceso, El subtotal no se calcular en base a las piezas, sino en base a numero de tramos
        // El precio del tramo se mandara desde el front

        const { precio_tramo } = cotizacion;
        let numero_tramos = atributos_formulario[0].alturaTotal / 2;
        if (atributos_formulario[0].alturaTotal % 2 !== 0) {
          numero_tramos = numero_tramos + 0.5;
        }
        subtotal = (Number(numero_tramos) * Number(precio_tramo));

      } else {
        subtotal = despiece.reduce(
          (acc, p) => acc + parseFloat(p.precio_alquiler_soles || 0),
          0
        );
      }
      moneda = "PEN";
      break;
    case "Venta":
      subtotal = despiece.reduce(
          (acc, p) => acc + parseFloat(p.precio_venta_soles || 0),
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
