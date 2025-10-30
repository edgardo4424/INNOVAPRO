const SequelizePedidoGuiaRepository = require("../../../pedidos_guias/infraestructure/repositories/sequelizePedidoGuiaRepository");
const actualizarPasePedido = require("../../application/useCases/actualizarPasePedido");
const actualizarPasePedidoAutomatico = require("../../application/useCases/actualizarPasePedidoAutomatico");
const crearPasePedido = require("../../application/useCases/crearPasePedido");
const obtenerPasesPedidoParaTv = require("../../application/useCases/obtenerPasesPedidoParaTv");
const obtenerPasesPedidos = require("../../application/useCases/obtenerPasesPedidos");
const SequelizePasePedidoRepository = require("../../infraestructure/repositories/sequelizePasePedidoRepository")


const pasePedidoRepository=new SequelizePasePedidoRepository();
const pedidoGuiaRepository=new SequelizePedidoGuiaRepository();

const  PasePedidoController={
    async crearPasePedido(req,res){
        try {
            const contrato_id=req.body.contrato_id;
            const response=await crearPasePedido(pasePedidoRepository,contrato_id);
            res.status(response.codigo).json(response.respuesta);
        } catch (error) {            
            res.status(500).json({error:error.message})
        }
    },
    async obtenerPasesPedidos(req,res){
        try {
            const usuario=req.usuario;
            const pases_pedidos= await obtenerPasesPedidos(usuario,pasePedidoRepository);
            res.status(pases_pedidos.codigo).json(pases_pedidos.respuesta)
        } catch (error) {
            console.log("Error encontrado: ",error);
            res.status(500).json({error:error.message})
        }
        
    },
    async actualizarPasePedido(req,res){
        try {
            const payload=req.body.payload;
            const pedido_id=req.body.pedido_id;
            const response=await actualizarPasePedido(payload,pedido_id,pasePedidoRepository);
            res.status(response.codigo).json(response.respuesta);
        } catch (error) {
            console.log("Error encontrado",error);
            res.status(500).json({error:error.message})
        }
    },
    async obtenerPasesPedidoParaTv(req,res){
        try {
            const fecha=req.params.fecha
            console.log("FECHA OBTENIDA: ", fecha);
            const pases_pedidos= await obtenerPasesPedidoParaTv(pasePedidoRepository,pedidoGuiaRepository,fecha);
            res.status(pases_pedidos.codigo).json(pases_pedidos.respuesta)
        } catch (error) {
            console.log("Error encontrado: ",error);
            res.status(500).json({error:error.message})
        }
        
    },
    async actualizarPasePedidoAutomatico(req,res){
        try {
            const contrato_id=req.body.contrato_id;
            const response=await actualizarPasePedidoAutomatico(contrato_id,pasePedidoRepository);
            res.status(response.codigo).json(response.respuesta);
        } catch (error) {
            console.log("Error encontrado",error);
            res.status(500).json({error:error.message})
        }
    },
}

module.exports=PasePedidoController