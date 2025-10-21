// Mapea respuesta de obtenerDatosPDF() o obtenerCotizacionPorId() a la forma canónica:
// formData.cotizacion = { id, codigo_documento, tipo, entidad:{cliente,obra,filial,contacto}, uso, totales, moneda, duracion_alquiler }

export function mapearCotizacionAContrato(data, cotizacionId) {
  // Soporta ambas fuentes:
  // - obtenerDatosPDF: data?.cotizacion, data?.cliente, data?.obra, data?.filial, data?.contacto, data?.uso
  // - obtenerCotizacionPorId: data con shape equivalente (nombres distintos en algunos casos)

  const cot = data?.cotizacion || data || {};

  const cliente = data?.cliente || cot?.cliente || {};
  const obra = data?.obra || cot?.obra || {};
  const filial = data?.filial || cot?.filial || {};
  const contacto = data?.contacto || cot?.contacto || {};
  const uso = data?.uso || cot?.uso || {};

  const subtotal =
    Number(
      cot?.subtotal_con_descuento_sin_igv ??
      cot?.subtotal_sin_igv ??
      0
    );
  const igv = Math.round((subtotal * 18) / 100 * 100) / 100;
  const total =
    Number(
      cot?.total_soles ??
      cot?.total ??
      subtotal + igv
    );

  return {
    id: Number(cotizacionId ?? cot?.id ?? data?.id ?? null),
    codigo_documento: cot?.codigo_documento ?? "",
    tipo: cot?.tipo_servicio ?? cot?.tipo_cotizacion ?? "",
    entidad: {
      cliente: {
        id: cliente?.id ?? null,
        razon_social: cliente?.razon_social ?? "",
        ruc: cliente?.ruc ?? "",
        domicilio_fiscal: cliente?.domicilio_fiscal ?? cliente?.direccion ?? "",
        cargo_representante: cliente?.cargo_representante ?? "",
        nombre_representante: cliente?.nombre_representante ?? "",
        documento_representante: cliente?.documento_representante ?? "",
        domicilio_representante: cliente?.domicilio_representante ?? "",
      },
      obra: {
        id: obra?.id ?? null,
        nombre: obra?.nombre ?? "",
        direccion: obra?.direccion ?? "",
        ubicacion: obra?.ubicacion ?? obra?.distrito ?? "",
      },
      filial: {
        id: filial?.id ?? null,
        razon_social: filial?.razon_social ?? "",
        ruc: filial?.ruc ?? "",
        nombre_representante: filial?.nombre_representante ?? "",
        documento_representante: filial?.documento_representante ?? "",
        cargo_representante: filial?.cargo_representante ?? "",
        telefono_representante: filial?.telefono_representante ?? "",
        domicilio_fiscal: filial?.domicilio_fiscal ?? "",
        direccion_almacen: filial?.direccion_almacen ?? "",
      },
      contacto: {
        id: contacto?.id ?? null,
        nombre: contacto?.nombre ?? "",
        correo: contacto?.correo ?? "",
      },
    },
    uso: {
      id: uso?.id ?? null,
      nombre: uso?.nombre ?? uso?.descripcion ?? "",
      resumenDespiece: {},
    },
    totales: { subtotal, igv, total },
    moneda: cot?.moneda ?? "PEN",
    duracion_alquiler: cot?.tiempo_alquiler_dias ?? null,
    descuento: cot?.descuento ?? null,
  };
}