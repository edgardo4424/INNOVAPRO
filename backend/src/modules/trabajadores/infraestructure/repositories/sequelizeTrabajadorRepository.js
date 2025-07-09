const {Trabajador} =require("../models/trabajadorModel")
const db = require("../../../../models");

class SequelizeTrabajadorRepository{

    async crear(trabajadorData){
        console.log('sequalize',trabajadorData);
        
        const trabajador=Trabajador.create(trabajadorData);
        return trabajador;
    }
}

module.exports=SequelizeTrabajadorRepository