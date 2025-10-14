const { Contrato } = require("../models/contratoModel");

class SequelizeContratoRepository{

    async crearContrato(payload,transaction=null){
        const contrato_creado= await Contrato.create(payload,{transaction});
        return contrato_creado;
    }
    async actualizarContrato(payload,transaction=null){
        const options={
            where:{
                id:payload.contrato_id
            },
        }
        if(transaction)options.transaction=transaction;
        await Contrato.update(payload,options);
    }

}

module.exports=SequelizeContratoRepository;