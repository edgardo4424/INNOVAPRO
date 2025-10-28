const pases_pedido_model = () => ({
  contrato_id:"",
  pedido_id:"",
  cotizacion_id:"",
  filial:"",
  estado:"",
  tipo_Servicio:"",
  guia_Envio_Cod_Traslado: "13",
  ubicacion:"",

  cliente_Tipo_Doc:"",
  cliente_Num_Doc:"",
  cliente_Razon_Social:"",
  nombre_Contacto:"",

  ot_Usuario_Pase: "",
  ot_Usuario_Revisado: "",
  ot_Respuesta_Pase: "",

  cm_Usuario: "",
  cm_Email: "",
  cm_Telefono: "",
  empresaProveedoraId: 1,
  clienteId: 0,
  obraId: 57,
  contactoId:79,


  obra: "",
  nro_contrato:"",
  empresa_Ruc:"",
  guia_Envio_Peso_Total:0,
  guia_Envio_Und_Peso_Total:"KGM",
  ValoresPublico:null,
  ValoresPrivado:null,
  guia_Envio_Partida_Ubigeo: "",
  guia_Envio_Partida_Direccion: "",
  guia_Envio_Llegada_Ubigeo: "",
  guia_Envio_Llegada_Direccion: "",
  detalle:[],
  tarea_id:null,
});

module.exports=pases_pedido_model