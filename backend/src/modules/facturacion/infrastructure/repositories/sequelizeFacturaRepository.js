const { Factura } = require('../models/facturaModel');
const { FacturaDetalle } = require('../models/facturaDetalleModel');
const { FormaPago } = require('../models/formaPagoModel');
const { Leyenda } = require('../models/leyendaModel');


class SequelizeFacturaRepository {

    async obtenerFacturas() {
        const facturas = await Factura.findAll({
            include: [
                { model: FacturaDetalle },
                { model: FormaPago },
                { model: Leyenda },
            ],
        });
        return facturas;
    }
}

module.exports = SequelizeFacturaRepository;
