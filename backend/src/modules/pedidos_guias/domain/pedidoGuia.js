class PedidoGuia {
  constructor({ id,contrato_id, pase_pedido_id, fecha_despacho, estado, guia_remision_id}) {
    this.id=id
    this.contrato_id = contrato_id;
    this.pase_pedido_id = pase_pedido_id;
    this.fecha_despacho = fecha_despacho;
    this.estado = estado;
    this.guia_remision_id=guia_remision_id
  }

  validar(editar=false) {
    let errores = [];
    if(editar){
        if(!id){
            errores.push("Envie el id del pedido_guia a editar")
        }
        if(!this.guia_remision_id){
            errores.push("Envie la guia de remisión a registrar.")
        }

    }
    if (!this.contrato_id) {
      errores.push("Envie el contrato a registrar.");
    }
    if (!this.pase_pedido_id) {
      errores.push("Envie el pase de pedido a registrar.");
    }
    if (!this.fecha_despacho) {
      errores.push("Envie la fecha de despacho a registrar");
    }
    const estados = ["Emitido", "Despachado"];
    if (!estados.includes(this.estado)) {
      errores.push("El estado enviado no coincide con los estados aceptados.");
    }
    return errores;
  }

  get(editar=false){
    const data={
        contrato_id:this.contrato_id,
        pase_pedido_id:this.pase_pedido_id,
        fecha_despacho:this.fecha_despacho,
        estado:this.estado
    }
    if (editar) {
        data.pedido_guia_id=this.id;
        data.guia_remision_id=this.guia_remision_id;
    }
    return data;
  }
}
