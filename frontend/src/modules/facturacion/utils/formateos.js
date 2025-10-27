const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d)
    ? dateStr
    : d.toLocaleString("es-PE", {
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

const quitarPuntos = (str) => str.replace(/\./g, "");

const nombreDocumentoADdescargar = (documento, tipo_archivo) => {
  const {
    serie,
    correlativo,
    numDocumentoComprobante,
    numRuc,
    razonSocial,
    tipoDoc,
    afectado_Num_Doc,
    afectado_Tipo_Doc,
    motivo_Cod,
  } = documento;
  switch (tipoDoc) {
    case "01":
      if (tipo_archivo == "pdf")
        return `F_. ${serie}-${Number(correlativo)} ${quitarPuntos(razonSocial)}`;
      if (tipo_archivo == "xml")
        return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      if (tipo_archivo == "cdr")
        return `R-${numRuc}-${tipoDoc}-${serie}-${correlativo}`;

    case "03":
      if (tipo_archivo == "pdf")
        return `B_. ${serie}-${Number(correlativo)} ${quitarPuntos(razonSocial)}`;
      if (tipo_archivo == "xml")
        return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      if (tipo_archivo == "cdr")
        return `R-${numRuc}-${tipoDoc}-${serie}-${correlativo}`;

    case "07":
      if (tipo_archivo == "pdf") {
        const [documentoAfectadoTipo, documentoAfectadoNum] = afectado_Num_Doc.split("-");
        return `NOTA DE CREDITO ${serie}-${Number(correlativo)} - ${getMotivoLabelArchivo(tipoDoc, motivo_Cod)} ${afectado_Tipo_Doc == "01" ? "F" : "B"}_. ${documentoAfectadoTipo}-${Number(documentoAfectadoNum)}`;
      }
      if (tipo_archivo == "xml")
        return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      if (tipo_archivo == "cdr")
        return `R-${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      return "NOTA DE CRÉDITO";

    case "08":
      if (tipo_archivo == "pdf") {
        const [documentoAfectadoTipo, documentoAfectadoNum] = afectado_Num_Doc.split("-");
        return `NOTA DE DEBITO ${serie}-${Number(correlativo)} - ${getMotivoLabelArchivo(tipoDoc, motivo_Cod)} ${afectado_Tipo_Doc == "01" ? "F" : "B"}_. ${documentoAfectadoTipo}-${Number(documentoAfectadoNum)}`;
      }
      if (tipo_archivo == "xml")
        return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      if (tipo_archivo == "cdr")
        return `R-${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      return "NOTA DE DEBITO";

    case "09":
      if (tipo_archivo == "pdf")
        return `G.${serie}-${correlativo} - ${quitarPuntos(razonSocial)}`;
      if (tipo_archivo == "xml")
        return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
      if (tipo_archivo == "cdr")
        return `R-${numRuc}-${tipoDoc}-${serie}-${correlativo}`;

    default:
      return `${numRuc}-${tipoDoc}-${serie}-${correlativo}`;
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
    {
      value: "01",
      label: "01 - Anulación de la operación",
      descripcion: "ANULACION DE OPERACION",
      desc_doc: "ANULADO",
    },
    {
      value: "02",
      label: "02 - Anulación por error en el RUC",
      descripcion: "ANULACION POR ERROR EN EL RUC",
      desc_doc: "ANULADO",
    },
    {
      value: "03",
      label: "03 - Corrección por error en la descripción",
      descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION",
      desc_doc: "CORREGIDO",
    },
    {
      value: "04",
      label: "04 - Descuento global",
      descripcion: "DESCUENTO GLOBAL",
      desc_doc: "DESCUENTO",
    },
    {
      value: "05",
      label: "05 - Descuento por ítem",
      descripcion: "DESCUENTO POR ITEM",
      desc_doc: "DESCUENTO",
    },
    {
      value: "06",
      label: "06 - Devolución total",
      descripcion: "DEVOLUCION TOTAL",
      desc_doc: "DEVOLUCION",
    },
    {
      value: "07",
      label: "07 - Devolución por ítem",
      descripcion: "DEVOLUCION POR ITEM",
      desc_doc: "DEVOLUCION",
    },
    {
      value: "10",
      label: "10 - Otros Conceptos",
      descripcion: "OTROS CONCEPTOS",
      desc_doc: "OTROS CONCEPTOS",
    },
  ],
  DEBITO: [
    {
      value: "01",
      label: "01 - Intereses por mora",
      descripcion: "INTERESES POR MORAS",
      desc_doc: "INTERES",
    },
    {
      value: "02",
      label: "02 - Aumento en el valor",
      descripcion: "AUMENTO EN EL VALOR",
      desc_doc: "AUMENTO",
    },
    {
      value: "03",
      label: "03 - Penalidades/ otros conceptos",
      descripcion: "PENALIDADES/ OTROS CONCEPTOS",
      desc_doc: "PENALIDAD",
    },
  ],
};

const getMotivoLabel = (tipoDoc, motivoCod) => {
  if (!motivoCod) return "—";
  const motivos = tipoDoc === "07" ? MOTIVOS_NOTA.CREDITO : MOTIVOS_NOTA.DEBITO;
  const motivo = motivos.find((m) => m.value === motivoCod);
  return motivo?.descripcion || motivoCod;
};

const getMotivoLabelArchivo = (tipoDoc, motivoCod) => {
  if (!motivoCod) return "—";
  const motivos = tipoDoc === "07" ? MOTIVOS_NOTA.CREDITO : MOTIVOS_NOTA.DEBITO;
  const motivo = motivos.find((m) => m.value === motivoCod);
  return motivo?.desc_doc || motivoCod;
};

// ?? Helper para obtener la descripción del motivo de traslado
const getMotivoTrasladoDescription = (code) => {
  switch (code) {
    case "01":
      return "VENTA";
    case "02":
      return "VENTA SUJETA A CONFIRMACION DEL COMPRADOR";
    case "04":
      return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
    case "05":
      return "CONSIGNACION";
    case "06":
      return "DEVOLUCION";
    case "07":
      return "RECOJO DE BIENES PARA TRASLADO POR PARTE DEL CLIENTE";
    case "08":
      return "IMPORTACION";
    case "09":
      return "EXPORTACION";
    case "13":
      return "OTROS - ALQUILER";
    case "14":
      return "VENTA CON ENTREGA A TERCEROS";
    case "15":
      return "TRASLADO DE BIENES PARA TRANSFORMACION";
    case "16":
      return "TRASLADO DE BIENES TRANSFORMADOS";
    case "17":
      return "TRASLADO PARA REPARACION";
    case "18":
      return "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO";
    case "19":
      return "TRASLADO A ZONA PRIMARIA";
    case "20":
      return "TRASLADO POR EMISOR ITINERANTE (COMPROBANTE DE PAGO)";
    default:
      return "NO ESPECIFICADO";
  }
};

const getCodigoTraslado = (code) => {
  switch (code) {
    case "01":
      return "VENTA";
    case "02":
      return "VENTA SUJETA A CONFIRMACION DEL COMPRADOR";
    case "04":
      return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
    case "05":
      return "CONSIGNACION";
    case "06":
      return "DEVOLUCION";
    case "07":
      return "RECOJO DE BIENES PARA TRASLADO POR PARTE DEL CLIENTE";
    case "08":
      return "IMPORTACION";
    case "09":
      return "EXPORTACION";
    case "13":
      return "OTROS";
    case "14":
      return "VENTA CON ENTREGA A TERCEROS";
    case "15":
      return "TRASLADO DE BIENES PARA TRANSFORMACION";
    case "16":
      return "TRASLADO DE BIENES TRANSFORMADOS";
    case "17":
      return "TRASLADO PARA REPARACION";
    case "18":
      return "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO";
    case "19":
      return "TRASLADO A ZONA PRIMARIA";
    case "20":
      return "TRASLADO POR EMISOR ITINERANTE (COMPROBANTE DE PAGO)";
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
  {
    value: "05",
    descripcion: "CONSIGNACION",
    descripcionmi: "Consignación",
  },
  {
    value: "06",
    descripcion: "DEVOLUCION",
    descripcionmi: "Devolución",
  },
  {
    value: "07",
    descripcion: "RECOJO DE BIENES PARA TRASLADO POR PARTE DEL CLIENTE",
    descripcionmi: "Recojo de bienes para traslado por parte del cliente",
  },
  { value: "08", descripcion: "IMPORTACION", descripcionmi: "Importación" },
  { value: "09", descripcion: "EXPORTACION", descripcionmi: "Exportación" },
  {
    value: "13",
    descripcion: "OTROS",
    descripcionmi: "Otros - Alquiler",
  },
  {
    value: "14",
    descripcion: "VENTA CON ENTREGA A TERCEROS",
    descripcionmi: "Venta con entrega a terceros",
  },
  {
    value: "15",
    descripcion: "TRASLADO DE BIENES PARA TRANSFORMACION",
    descripcionmi: "Traslado de bienes para transformación",
  },
  {
    value: "16",
    descripcion: "TRASLADO DE BIENES TRANSFORMADOS",
    descripcionmi: "Traslado de bienes transformados",
  },
  {
    value: "17",
    descripcion: "TRASLADO PARA REPARACION",
    descripcionmi: "Traslado para reparación",
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
  "REPARACION",
  "OTROS",
];

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
  formatCurrency,
  nombreDocumentoADdescargar,
  quitarPuntos,
};
