
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const getTipoDocLabel = (code) => {
  switch (code) {
    case "07":
      return "NOTA DE CRÉDITO";
    case "08":
      return "NOTA DE DÉBITO";
    default:
      return "NOTA ELECTRÓNICA";
  }
};

const getTipoResumido = (code) => {
  switch (code) {
    case "01":
      return "FACTURA";
    case "03":
      return "BOLETA";
    case "09":
      return "GUÍA DE REMISIÓN";
    case "07":
      return "NOTA DE CRÉDITO";
    case "08":
      return "NOTA DE DÉBITO";
    default:
      return "NOTA ELECTRÓNICA";
  }
};

const getModalidadTrasladoDescription = (code) => {
  switch (code) {
    case "01":
      return "TRANSPORTE PÚBLICO";
    case "02":
      return "TRANSPORTE PRIVADO";
    default:
      return "NO ESPECIFICADO";
  }
};

const getTipoDocCliente = (code) => {
  switch (String(code)) {
    case "6":
      return "RUC";
    case "1":
      return "DNI";
    case "4":
      return "CARNET DE EXTRANJERÍA";
    default:
      return "OTRO";
  }
};

// ?? Helper para obtener la descripción del tipo de documento de la guía
const getTipoDocGuiaDescription = (typeCode) => {
  switch (typeCode) {
    case "09":
      return "GUÍA DE REMISIÓN ELECTRÓNICA";
    // ?? Puedes añadir más tipos de documentos de guía si los manejas
    default:
      return "DOCUMENTO DE GUÍA NO ESPECIFICADO";
  }
};

//? Helper to get document type description
const getTipoDocDescription = (typeCode) => {
  switch (typeCode) {
    case "01":
      return "FACTURA ELECTRÓNICA";
    case "03":
      return "BOLETA DE VENTA ELECTRÓNICA";
    case "07":
      return "NOTA DE CRÉDITO ELECTRÓNICA";
    case "08":
      return "NOTA DE DÉBITO ELECTRÓNICA";
    case "09":
      return "GUÍA DE REMISIÓN ELECTRÓNICA";
    default:
      return "DOCUMENTO NO ESPECIFICADO";
  }
};

const MOTIVOS_NOTA = {
  CREDITO: [
    { value: "01", label: "01 - Anulación de la operación", descripcion: "ANULACION DE OPERACION" },
    { value: "02", label: "02 - Anulación por error en el RUC", descripcion: "ANULACION POR ERROR EN EL RUC" },
    { value: "03", label: "03 - Corrección por error en la descripción", descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION" },
    { value: "04", label: "04 - Descuento global", descripcion: "DESCUENTO GLOBAL" },
    { value: "05", label: "05 - Descuento por ítem", descripcion: "DESCUENTO POR ITEM" },
    { value: "06", label: "06 - Devolución total", descripcion: "DEVOLUCION TOTAL" },
    { value: "07", label: "07 - Devolución por ítem", descripcion: "DEVOLUCION POR ITEM" },
    { value: "10", label: "10 - Otros Conceptos", descripcion: "OTROS CONCEPTOS" },
  ],
  DEBITO: [
    { value: "01", label: "01 - Intereses por mora", descripcion: "INTERESES POR MORAS" },
    { value: "02", label: "02 - Aumento en el valor", descripcion: "AUMENTO EN EL VALOR" },
    { value: "03", label: "03 - Penalidades/ otros conceptos", descripcion: "PENALIDADES/ OTROS CONCEPTOS" },
  ],
};

const getMotivoLabel = (tipoDoc, motivoCod) => {
  if (!motivoCod) return "—";
  const motivos = tipoDoc === "07" ? MOTIVOS_NOTA.CREDITO : MOTIVOS_NOTA.DEBITO;
  const motivo = motivos.find((m) => m.value === motivoCod);
  return motivo?.descripcion || motivoCod;
};

// ?? Helper para obtener la descripción del motivo de traslado
const getMotivoTrasladoDescription = (code) => {
  switch (code) {
    case "01":
      return "VENTA";
    case "02":
      return "COMPRA";
    case "04":
      return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
    case "08":
      return "IMPORTACIÓN";
    case "09":
      return "EXPORTACIÓN";
    case "18":
      return "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO";
    case "19":
      return "TRASLADO A ZONA PRIMARIA";
    case "13":
      return "OTROS";
    default:
      return "NO ESPECIFICADO";
  }
};

const getCodigoTraslado = (code) => {
  switch (code) {
    case "01":
      return "Venta";
    case "02":
      return "Venta sujeta a confirmación del comprador";
    case "04":
      return "Traslado entre establecimientos de la misma empresa";
    case "08":
      return "Importación";
    case "09":
      return "Exportación";
    case "13":
      return "Otros - Alquiler";
    case "14":
      return "Venta con entrega a terceros";
    case "18":
      return "Traslado emisor itinerante de comprobantes de pago";
    case "19":
      return "Traslado a zona primaria";
    case "20":
      return "Traslado por emisor itinerante (comprobante de pago)";
    default:
      return code;
  }
};

const getModalidadTrasladoLabel = (code) => {
  switch (code) {
    case "01":
      return "PÚBLICO";
    case "02":
      return "PRIVADO";
    default:
      return code;
  }
};

  const formatCurrency = (amount, moneda = "PEN") => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: 2,
    }).format(amount);
  };

const opcionesCodigos = [
  { value: "01", descripcion: "VENTA", descripcionmi: "Venta" },
  {
    value: "02",
    descripcion: "VENTA SUJETA A CONFIRMACION DEL COMPRADOR",
    descripcionmi: "Venta sujeta a confirmación del comprador",
  },
  {
    value: "04",
    descripcion: "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA",
    descripcionmi: "Traslado entre establecimientos de la misma empresa",
  },
  { value: "08", descripcion: "IMPORTACION", descripcionmi: "Importación" },
  { value: "09", descripcion: "EXPORTACION", descripcionmi: "Exportación" },
  { value: "13", descripcion: "OTROS", descripcionmi: "Otros - Alquiler" },
  {
    value: "14",
    descripcion: "VENTA CON ENTREGA A TERCEROS",
    descripcionmi: "Venta con entrega a terceros",
  },
  {
    value: "18",
    descripcion: "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO",
    descripcionmi: "Traslado emisor itinerante de comprobantes de pago",
  },
  {
    value: "19",
    descripcion: "TRASLADO A ZONA PRIMARIA",
    descripcionmi: "Traslado a zona primaria",
  },
  {
    value: "20",
    descripcion: "TRASLADO POR EMISOR ITINERANTE (COMPROBANTE DE PAGO)",
    descripcionmi: "Traslado por emisor itinerante (comprobante de pago)",
  },
];

const opcionesOtros = [
  "PRESTAMO",
  "ENVIO DE ALQUILER",
  "DEVOLUCION",
  "REPARACION",
  "OTROS"
]

export {
  formatDateTime,
  getTipoDocLabel,
  getTipoDocCliente,
  getTipoDocGuiaDescription,
  getTipoDocDescription,
  getModalidadTrasladoDescription,
  getMotivoTrasladoDescription,
  getMotivoLabel,
  getCodigoTraslado,
  getModalidadTrasladoLabel,
  opcionesCodigos,
  opcionesOtros,
  getTipoResumido,
  formatCurrency
};