const Contrato = require("../../domain/entities/contrato");
 
module.exports = async (contratoRepository,payload,transaction=null)=>{
    const contrato=new Contrato(payload);
    const errores=contrato.validar();
    if(errores.length>0){
        return{
            codigo:405,
            respuesta:errores
        }
    }
    const contrato_validado=contrato.get();
    console.log("Data validada en creacion de contrato: ",contrato_validado);
    
    const contrato_creado=await contratoRepository.crearContrato(contrato_validado,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato creado exitosamente",
            contrato:contrato_creado
        }
    }
}

