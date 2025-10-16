// Estado inicial del WIZARD DE CONTRATOS.
// Un contrato NACE de una COTIZACIÓN y hereda toda su data.

const formDataInicialContrato = {
  // DATA QUE TRAEMOS DE LA COTIZACIÓN
  cotizacion: {
    entidad: {
        contacto: {
            id: null,
            nombre: "",
            correo: "",
        },
        cliente: {
            id: null,
            razon_social: "",
            ruc: "",
            domicilio_fiscal: "",
            cargo_representante: "",
            nombre_representante: "G",
            documento_representante: "",
            domicilio_representante: "",
        },
        obra: {
            id: null,
            nombre: "",
            direccion: "",
            ubicacion: ""
        },
        filial: {
            id: null,
            razon_social: "",
            ruc: "",
            nombre_representante: "",
            documento_representante: "",
            cargo_representante: "",
            telefono_representante: "",
            domicilio_fiscal: "",
            direccion_almacen: "",

        }
    },
    uso: {
        id: null,
        nombre: "",
        resumenDespiece: {}
    },
    id: null,
    codigo_documento: "",
    tipo: "",
    moneda: "",
    duracion_alquiler: null,
    descuento: null,
    condiciones_alquiler: [],
    totales: { subtotal: null, igv: null, total: null },
  },

  // CONDICIONES LEGALES DEL CONTRATO
  legales: {
    vigencia: {
      inicio: "", // YYYY-MM-DD
      fin: "", // YYYY-MM-DD
    },
    clausulas: [],
  },

  // VALORIZACIONES
  valorizacion: {
    requiere_adelantada: false,
    renovaciones: "",
  },

  // FIRMAS
  firmas: {
    // DEBO ANALIZAR COMO MANEJARLO
  },

  // REVISIÓN Y ENVÍO
  envio: {
    // PARA CORREOS AUTOMÁTICOS DEBO ANALIZARLO MEJOR
    /* enviar_correo: false,
    destinatarios: [], // ["correo@cliente.com"]
    asunto: "",
    cuerpo: "", */
  },

};

export default formDataInicialContrato;