module.exports=async(contrato_id,pasePedidoRepository,transaction=null)=>{
    await pasePedidoRepository.actualizarPasePedidoAutomatico(contrato_id, transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Pase pedido actualizado correctamnete",
            status:200
        }
    }
}