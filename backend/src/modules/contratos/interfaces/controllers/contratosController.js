const actualizarContrato = require("../../application/useCases/actualizarContrato");
const crearContrato = require("../../application/useCases/crearContrato");
const obtenerContratos = require("../../application/useCases/obtenerContratos");
const autocompletarCotizacionParaCrearContrato = require("../../application/useCases/autocompletarCotizacionParaCrearContrato");

const SequelizeContratoRepository = require("../../infraestructure/repositories/sequelizeContratoRepository");
const contratoRepository=new SequelizeContratoRepository();

const ContratoController={
    async crearContrato(req,res){
        console.log("Entro a la función de crear contrato");
        const payload=req.body;
        const usuario_id=req.usuario.id;
        try {
            const contratoResponse= await crearContrato(payload,usuario_id, contratoRepository);
            res.status(contratoResponse.codigo).json(contratoResponse.respuesta)
        } catch (error) {
            console.log("Ocurrio el siguiente error: ",error)
            res.status(500).json({error:error.message})
        }
    },
    async actualizarContrato(req,res){        
        console.log("Entro a la función de actualizar contrato");
        try {
            const payload=req.body;
            const usuario_id=req.usuario.id;
            const contratoResponse=await actualizarContrato(payload, usuario_id, contratoRepository);
            res.status(contratoResponse.codigo).json(contratoResponse.respuesta)
        } catch (error) {
            console.log("Ocurrio el siguiente error: ",error)
            res.status(500).json({error:error.message})
        }
    },

    async obtenerContratos(req,res){
        console.log("Entro a la función de listar contratos");
        try {
            const contratos= await obtenerContratos(contratoRepository);
            res.status(contratos.codigo).json(contratos.respuesta)
        } catch (error) {
            console.log("Ocurrio el siguiente error: ",error)
            res.status(500).json({error:error.message})
        }
    },

    async autocompletarCotizacionParaCrearContrato(req,res){
        console.log("Entro a la función de autocompletar cotización para crear contrato");
        try {
            const cotizacion_id=req.params.id;
            const cotizacionResponse= await autocompletarCotizacionParaCrearContrato(cotizacion_id, contratoRepository);
            console.log("Respuesta de autocompletarCotizacionParaCrearContrato:", cotizacionResponse);
            res.status(cotizacionResponse.codigo).json(cotizacionResponse.respuesta);
        } catch (error) {
            console.log("Ocurrio el siguiente error: ",error)
            res.status(500).json({error:error.message})
        }
    }
}
module.exports=ContratoController