 const pases_pedido_model = () => ({
  obra: "",
  nro_contrato:"",
  id_pedido:"",
  empresa_ruc:"",
  cliente_tipo_Doc:"",
  cliente_num_Doc:"",
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