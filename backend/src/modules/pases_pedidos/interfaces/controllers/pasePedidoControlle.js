const crearPasePedido = require("../../application/useCases/crearPasePedido");
const obtenerPasesPedidos = require("../../application/useCases/obtenerPasesPedidos");
const SequelizePasePedidoRepository = require("../../infraestructure/repositories/sequelizePasePedidoRepository")


const pasePedidoRepository=new SequelizePasePedidoRepository();

const  PasePedidoController={
    async crearPasePedido(req,res){
        try {
            const payload=req.body;
            const response=await crearPasePedido(pasePedidoRepository,payload);
            res.status(response.codigo).json(response.respuesta);
        } catch (error) {
            console.log("Entrando al catch");
            
            res.status(500).json({error:error.message})
        }
    },
    async obtenerPasesPedidos(req,res){
        try {
            const pases_pedidos= await obtenerPasesPedidos(pasePedidoRepository);
            res.status(pases_pedidos.codigo).json(pases_pedidos.respuesta)
        } catch (error) {
            console.log("Error encontrado: ",error);
            
            res.status(500).json({error:error.message})
        }
        
    }
}

module.exports=PasePedidoController