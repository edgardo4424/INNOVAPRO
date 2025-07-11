// Este archivo define los datos iniciales del formulario de cotización
// que se utilizarán en el wizard de registro de cotizaciones.

const formDataInicial = {
  cotizacionId: "",
  contacto_id: "",
  contacto_nombre: "",
  cliente_id: "",
  cliente_nombre: "",
  obra_id: "",
  obra_nombre: "",
  obra_direccion: "",
  obra_ubicacion: "",
  filial_id: "",
  filial_nombre: "",
  uso_id: null,
  tipo_cotizacion: "Alquiler",
  zonas: [],
  despiece: [],
  descuento: 0,
  requiereAprobacion: false,
  tiene_transporte: "",
  tipo_transporte: "",
  costo_tarifas_transporte: 0,
  costo_distrito_transporte: 0,
  costo_pernocte_transporte: 0,
  tiene_instalacion: undefined,
  tipo_instalacion: "",
  precio_instalacion_completa: 0,
  precio_instalacion_parcial: 0,
  nota_instalacion: "",
  tiene_pernos_disponibles: false,
  tiene_pernos: undefined,
  duracion_alquiler: 0
};

export default formDataInicial;