module.exports=async(id,pasePedidoRepository,transaction=null)=>{
    if(!id){
        return{
            codigo:400,
            respuesta:{
                mensaje:"Datos incompletos para la operación"
            }
        }
    }
    const pase_pedido=await pasePedidoRepository.obtenerPasePedidoPorId(id,transaction);
    console.log(pase_pedido);
    
    return{
        codigo:201,
        respuesta:{
            mensaje:"Pase de pedido encontrado",
            pase_pedido
        }
    } 
}