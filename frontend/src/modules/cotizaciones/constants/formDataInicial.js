// Este archivo define los datos iniciales del formulario de cotización
// que se utilizarán en el wizard de registro de cotizaciones.

const formDataInicial = {
  entidad: {
    cliente: {
      id: "",
      razon_social: "",
    },
    contacto: {
      id: "",
      nombre: "",
    },
    obra: {
      id: "",
      nombre: "",
      direccion: "",
      ubicacion: "",
    },
    filial: {
      id: "",
      razon_social: "",
    }
  },
  uso: {
    id: "",
    nombre: "",
    zonas: [],
    despiece: [],
    resumenDespiece: {},
  },
  cotizacion: {
    id: "",
    tipo: "Alquiler",
    duracion_alquiler: 0,
    descuento: 0,
    requiereAprobacion: false,
  },
  atributos_opcionales: {
    transporte: {
      tiene_transporte: "",
      tipo_transporte: "",
      costo_tarifas_transporte: 0,
      costo_distrito_transporte: 0,
      costo_pernocte_transporte: 0,
    },
    instalacion: {
      tiene_instalacion: undefined,
      tipo_instalacion: "",
      precio_instalacion_completa: 0,
      precio_instalacion_parcial: 0,
      nota_instalacion: "",
    },
    pernos: {
      tiene_pernos_disponibles: false,
      tiene_pernos: undefined,
    }
  }
};

export default formDataInicial;