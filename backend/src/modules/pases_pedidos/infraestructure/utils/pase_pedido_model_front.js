const pases_pedido_model = () => ({
  id_contrato:"",
  id_pedido:"",
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

  cm_Usuario: "Kaya Chalco",
  cm_Email: "B2p3w@example.com",
  cm_Telefono: "987654321",



  obra: "",
  nro_contrato:"",
  empresa_Ruc:"",
  guia_Envio_Peso_Total:0,
  guia_Envio_Und_Peso_Total:"KGM",
  detalle:[],
  ValoresPublico:null,
  ValoresPrivado:null,
  guia_Envio_Partida_Ubigeo: "",
  guia_Envio_Partida_Direccion: "",
  guia_Envio_Llegada_Ubigeo: "",
  guia_Envio_Llegada_Direccion: "",
});

module.exports=pases_pedido_model