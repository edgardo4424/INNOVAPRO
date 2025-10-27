module.exports=async(payload,stockPedidoPiezaRepository,transaction=null)=>{
    
    const stock_pedido_pieza=await stockPedidoPiezaRepository.crearStockPedidoPieza(payload,transaction);

    return{
        codigo:200,
        respuesta:{
            mensaje:"Stock del pedido pieza creado correctamente",
            stock_pedido_pieza
        }
    }
}