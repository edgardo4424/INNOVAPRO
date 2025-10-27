// Mapea respuesta de obtenerDatosPDF() o obtenerCotizacionPorId() a la forma canónica:
// formData.cotizacion = { id, codigo_documento, tipo, entidad:{cliente,obra,filial,contacto}, uso, totales, moneda, duracion_alquiler }

export function mapearCotizacionAContrato(data, cotizacionId) {
  // Soporta ambas fuentes:
  // - obtenerDatosPDF: data?.cotizacion, data?.cliente, data?.obra, data?.filial, data?.contacto, data?.uso
  // - obtenerCotizacionPorId: data con shape equivalente (nombres distintos en algunos casos)

  const cot = data.cotizacion || {};

  const cliente = data?.cliente || cot?.cliente || {};
  const firmantes = data?.firmantes || {};
  const obra = data?.obra || cot?.obra || {};
  const filial = data?.filial || cot?.filial || {};
  const contacto = data?.contacto || cot?.contacto || {};
  const uso = data?.uso || cot?.uso || {};

  const subtotal =
    Number(
      cot?.subtotal_con_descuento_sin_igv ??
      0
    );
  const igv = cot?.igv_monto;
  const total = cot?.total_final;

  return {
    id: Number(cotizacionId ?? cot?.id ?? data?.id ?? null),
    codigo_documento: cot?.codigo_documento ?? "",
    tipo: cot?.tipo_servicio ?? cot?.tipo_cotizacion ?? "",
    entidad: {
      cliente: {
        id: cliente?.id ?? null,
        razon_social: cliente?.nombre_cliente ?? "",
        ruc: cliente?.numero_documento ?? "",
        domicilio_fiscal: cliente?.domicilio_fiscal ?? cliente?.direccion ?? "",
        cargo_representante: firmantes?.cliente.cargo_representante_legal ?? "",
        nombre_representante: firmantes?.cliente.nombre_representante_legal ?? "",
        documento_representante: firmantes?.cliente.numero_documento_representante_legal ?? "",
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
        nombre_representante: firmantes?.filial.nombre_representante_legal ?? "",
        documento_representante: firmantes?.filial.numero_documento_representante_legal ?? "",
        cargo_representante: firmantes?.filial.cargo_representante_legal ?? "",
        telefono_representante: firmantes?.filial.telefono_representante_legal ?? "",
        domicilio_fiscal: firmantes?.filial.domicilio_representante_legal ?? "",
        direccion_almacen: filial.direccion_almacen ?? "",
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