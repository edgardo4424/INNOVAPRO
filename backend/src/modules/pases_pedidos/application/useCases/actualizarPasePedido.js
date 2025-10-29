module.exports=async(payload,pedido_id,pasePedidoRepository,transaction=null)=>{
    await pasePedidoRepository.actualizarPasePedido(payload,pedido_id,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Pase pedido actualizado correctamnete",
            status:200
        }
    }
}