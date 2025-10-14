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
    const contrato_validado=contrato.get(true);
    console.log("Data validada en actualizar contrato: ",contrato_validado);

    await contratoRepository.actualizarContrato(contrato_validado,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato actualizado correctamente"
        }
    }
}