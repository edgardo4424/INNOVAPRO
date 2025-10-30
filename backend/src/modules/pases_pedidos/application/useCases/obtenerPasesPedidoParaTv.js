const pasePedidoEstructura = require("../../infraestructure/utils/pasePedidoEstructura");
const pedidoGuiaEstructura = require("../../infraestructure/utils/pedidoGuiaEstructura");

module.exports =async(pasePedidoRepository,pedidoGuiaRepository,fecha,transaction=null)=>{
    console.log("FECHA RECIBIDA: ",fecha);
    
    const response_pases_pedidos=await pasePedidoRepository.obtenerPasesPedidoParaTv(transaction);
    const response_pedidos_guias=await pedidoGuiaRepository.obtenerPedidoGuiaParaTv(transaction);

    let confirmado=[]
    for (const pase_pedido of response_pases_pedidos) {
        const payload=pasePedidoEstructura();
        payload.id=pase_pedido.id;
        payload.contrato_id=pase_pedido.contrato_id;
        payload.razon_social=pase_pedido.contrato.filial.razon_social;
        payload.ref_contrato=pase_pedido.contrato.ref_contrato;
        payload.filial=pase_pedido.contrato.filial.ruc;
        payload.cliente_ruc=pase_pedido.contrato.cliente.ruc||"No Definido";
        payload.cliente_razon_social=pase_pedido.contrato.cliente.razon_social;
        payload.estado=pase_pedido.estado;
        payload.fecha_confirmacion=pase_pedido.fecha_confirmacion;
        let guias_obtenidas=[]
        for (const guia of pase_pedido.pedidos_guias) {
            const guia_data={
                id:guia.guia_remision_id,
                guia_nro:`${guia.guia_remision.serie}-${guia.guia_remision.correlativo}`  
            }
            guias_obtenidas.push(guia_data)
        }
        payload.guias=guias_obtenidas;
        confirmado.push(payload);
    }
    let almacen=[];
    let despachado=[];
    for (const data of response_pedidos_guias) {
        const pedido_guia=data.get({plain:true});
        const payload=pedidoGuiaEstructura();
        payload.id=pedido_guia.pase_pedido.id;
        payload.contrato_id=pedido_guia.contrato_id;
        payload.ref_contrato=pedido_guia.contrato.ref_contrato;
        payload.filial=pedido_guia.contrato.filial.ruc;
        payload.razon_social=pedido_guia.contrato.filial.razon_social;
        payload.cliente_ruc=pedido_guia.contrato.cliente.ruc||"No definido";
        payload.cliente_razon_social=pedido_guia.contrato.cliente.razon_social;
        payload.pedido_guia_id=pedido_guia.id;
        payload.guia_nro=`${pedido_guia.guia_remision.serie}-${pedido_guia.guia_remision.correlativo}`;
        payload.estado=pedido_guia.estado;
        payload.fecha_emision_guia=pedido_guia.guia_remision.fecha_Emision;
        payload.fecha_despacho=pedido_guia.fecha_despacho;
        payload.fecha_confirmacion=pedido_guia.pase_pedido.fecha_confirmacion;
        console.log(payload);
        if(payload.estado==="Despachado"&&payload.fecha_despacho==fecha){
            despachado.push(payload);
        }
        else{
            almacen.push(payload)
        }
        
    }
    let mensaje_respuesta="Pases obtenidos satisfactoriamente.";
    if(response_pases_pedidos.length==0&&response_pedidos_guias.length==0){
        mensaje_respuesta="No se encontraron pedidos"
    }
    return{
        codigo:200,
        respuesta:{
            mensaje:mensaje_respuesta,
            confirmado:{
                list:confirmado,
                total:confirmado.length,
            },
            almacen:{
                list:almacen,
                total:almacen.length
            },
            despachado:{
                list:despachado,
                total:despachado.length
            }
        }
    }

}