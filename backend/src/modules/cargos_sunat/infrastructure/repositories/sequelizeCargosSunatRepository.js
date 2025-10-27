const { CargosSunat } = require("../models/cargosSunatModel");

class SequelizeCargosSunatRepository {

    async obtenerCargosSunat(cargo_innova_id, transaction = null) {
        return await CargosSunat.findAll({where: { id_cargo: cargo_innova_id }},{ transaction }); 
    }

    async obtenerTodosLosCargosSunat(transaction = null) {
        return await CargosSunat.findAll({},{ transaction }); 
    }

}

module.exports = SequelizeCargosSunatRepository; 