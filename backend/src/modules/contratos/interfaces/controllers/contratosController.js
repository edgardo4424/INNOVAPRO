const actualizarContrato = require("../../application/useCases/actualizarContrato");
const crearContrato = require("../../application/useCases/crearContrato");
const SequelizeContratoRepository = require("../../infraestructure/repositories/sequelizeContratoRepository");

const contratoRepository=new SequelizeContratoRepository();
const ContratoController={
    async crearContrato(req,res){
        console.log("Entro a la función de crear contrato");
        const payload=req.body;
        try {
            const contratoResponse= await crearContrato(contratoRepository,payload);
            res.status(contratoResponse.codigo).json(contratoResponse.respuesta)
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },
    async actualizarContrato(req,res){        
        console.log("Entro a la función de actualizar contrato");
        try {
            const payload=req.body;
            const contratoResponse=await actualizarContrato(contratoRepository,payload);
            res.status(contratoResponse.codigo).json(contratoResponse.respuesta)
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    }
}

module.exports=ContratoController