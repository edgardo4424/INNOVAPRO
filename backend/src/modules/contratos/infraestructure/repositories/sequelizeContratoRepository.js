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

    async buscarContratoPorCotizacionId(cotizacion_id,transaction=null){
        const options={
            where:{
                cotizacion_id
            },
        }
        if(transaction)options.transaction=transaction;
        const contratoEncontrado= await Contrato.findOne(options);
        return contratoEncontrado;
    }

    async obtenerContratos(transaction=null){
        const options={};
        if(transaction)options.transaction=transaction;
        const contratos= await Contrato.findAll(options);
        return contratos;
    }

}

module.exports=SequelizeContratoRepository;