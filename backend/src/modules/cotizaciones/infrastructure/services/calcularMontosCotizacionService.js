function calcularMontosCotizacion({despiece, tipoCotizacion, cotizacion}) {

  const igvPorcentaje = parseFloat(cotizacion.igv_porcentaje ?? 0) || 0;
  const porcentajeDescuento = parseFloat(cotizacion.porcentaje_descuento ?? 0) || 0;

  let subtotal = 0;
  let moneda = "";

  switch (tipoCotizacion) {
    case "Alquiler":
      subtotal = despiece.reduce((acc, p) => acc + parseFloat(p.precio_alquiler_soles || 0), 0);
      moneda = "PEN";
      break;
    case "Venta":
      subtotal = despiece.reduce((acc, p) => acc + parseFloat(p.precio_venta_dolares || 0), 0);
      moneda = "USD";
      break;
  }

  const subtotalConDescuento = parseFloat(((100 - porcentajeDescuento) * subtotal * 0.01).toFixed(2));
  const igvMonto = parseFloat((subtotalConDescuento * igvPorcentaje * 0.01).toFixed(2));
  const total = subtotalConDescuento + igvMonto;

  return {
    dataParaGuardarDespiece: {
      moneda,
      subtotal: subtotal.toFixed(2),
      porcentaje_descuento: porcentajeDescuento,
      subtotal_con_descuento: subtotalConDescuento,
      igv_porcentaje: igvPorcentaje,
      igv_monto: igvMonto,
      total_final: total.toFixed(2)
    }
  };
  }

  module.exports = { calcularMontosCotizacion };