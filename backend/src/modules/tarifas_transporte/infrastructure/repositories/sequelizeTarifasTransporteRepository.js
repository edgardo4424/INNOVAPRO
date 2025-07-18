const { TarifasTransporte } = require("../models/tarifasTransporteModel");

class SequelizeTarifasTransporteRepository {
    getModel() {
        return require('../models/tarifasTransporteModel').TarifasTransporte;
    }

    async obtenerTarifasTransporte() {
        return await TarifasTransporte.findAll();
    }

}

module.exports = SequelizeTarifasTransporteRepository;