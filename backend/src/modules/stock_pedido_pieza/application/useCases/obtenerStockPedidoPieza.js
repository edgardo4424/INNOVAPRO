module.exports=async(payload,stockPedidoPiezaRepository,transaction=null)=>{
    
    const stock_pedido_pieza=await stockPedidoPiezaRepository.obtenerStockPedidoPieza(payload,transaction);

    return{
        codigo:200,
        respuesta:{
            mensaje:"Stock Pedido pieza ya ha sido creado",
            stock_pedido_pieza
        }
    }
}