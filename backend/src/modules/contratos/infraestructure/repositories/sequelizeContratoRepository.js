const { Contrato } = require("../models/contratoModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

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
        const contratos= await Contrato.findAll({
            // Incluir asociaciones si es necesario
            include: [
                {
                          model: db.clientes,
                          as: "cliente",
                          attributes: ["id", "razon_social", "ruc"],
                        },
                        {
                          model: db.obras,
                          as: "obra",
                          attributes: ["id", "nombre", "direccion"],
                        },
                        {
                          model: db.usuarios,
                          as: "usuario",
                          attributes: ["id"],
                          include: [{
                            model: db.trabajadores,
                            as: "trabajador",
                          }],
                        },
                        {
                          model: db.usos,
                          as: "uso",
                          attributes: ["id", "descripcion"],
                        },
                        {
                          model: db.despieces,
                          as: "despiece",
                          attributes: ["id", "cp"],
                        },
            ]
        }, options);
        return contratos;
    }

}

module.exports=SequelizeContratoRepository;