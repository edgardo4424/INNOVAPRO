const { Ubigeo } = require("../models/ubigeoModel");

class SequelizeUbigeoRepository {
    static toNumber(value) {
        return value != null ? parseFloat(value) : 0;
    }

    async obtenerUbigeo(distrito, provincia, departamento) {
        const ubigeo = await Ubigeo.findOne({
            where: {
                distrito: distrito.toUpperCase(),
                provincia: provincia.toUpperCase(),
                departamento: departamento.toUpperCase(),
            },
        });
        if (!ubigeo) return null;
        return ubigeo;
    }
}

module.exports = SequelizeUbigeoRepository;