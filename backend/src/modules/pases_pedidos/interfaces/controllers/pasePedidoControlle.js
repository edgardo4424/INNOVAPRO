const obtenerPasesPedidosConfirmados = require("../../application/obtenerPasesPedidosConfirmados")
const SequelizePasePedidoRepository = require("../../infraestructure/repositories/sequelizePasePedidoRepository")


const pasePedidoRepository=new SequelizePasePedidoRepository();

const  PasePedidoController={
    async obtenerPasesPedidosConfirmados(req,res){
        try {
            const pases_pedidos= await obtenerPasesPedidosConfirmados(pasePedidoRepository);
            res.status(pases_pedidos.codigo).json(pases_pedidos.respuesta)
        } catch (error) {
            res.status(500).json({error:error.message})
        }
        
    }
}

module.exports=PasePedidoController