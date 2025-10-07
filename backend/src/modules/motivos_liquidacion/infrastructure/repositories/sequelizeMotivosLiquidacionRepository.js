const { MotivosLiquidacion } = require("../models/motivosLiquidacionModel");

class SequelizeMotivosLiquidacionRepository {

    async obtenerMotivosLiquidacion(transaction = null) {
        return await MotivosLiquidacion.findAll({ transaction }); 
    }

    async obtenerMotivoLiquidacionPorId(id, transaction = null) {
        return await MotivosLiquidacion.findByPk(id, { transaction}); 
    }
}

module.exports = SequelizeMotivosLiquidacionRepository; 