const { CargosSunat } = require("../models/cargosSunatModel");

class SequelizeCargosSunatRepository {

    async obtenerCargosSunat(cargo_innova_id, transaction = null) {
        return await CargosSunat.findAll({where: { id_cargo: cargo_innova_id }},{ transaction }); 
    }

}

module.exports = SequelizeCargosSunatRepository; 