const { CotizacionesTransporte } = require("../models/cotizacionesTransporteModel");

class SequelizeCotizacionesTransporteRepository {
    getModel() {
        return require('../models/cotizacionesTransporteModel').CotizacionesTransporte;
    }

    async obtenerCotizacionesTransporte() {
        return await CotizacionesTransporte.findAll();
    }

}

module.exports = SequelizeCotizacionesTransporteRepository;