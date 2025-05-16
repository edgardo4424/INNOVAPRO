const { DistritosTransporte } = require("../models/distritosTransporteModel");

class SequelizeDistritosTransporteRepository {
    getModel() {
        return require('../models/distritosTransporteModel').DistritosTransporte;
    }

    async obtenerDistritosTransporte() {
        return await DistritosTransporte.findAll();
    }

}

module.exports = SequelizeDistritosTransporteRepository;