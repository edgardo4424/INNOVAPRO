const Contrato = require("../../domain/entities/contrato")

module.exports =async(contratoRepository,payload,transaction=null)=>{
    const contrato= new Contrato(payload);
    const errores=contrato.validar(true);
    if(errores.lenght>0){
        return {
            codigo:405,
            respuesta:errores
        }
    }

    await contratoRepository.actualizarContrato(contrato,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato actualizado correctamente"
        }
    }
}