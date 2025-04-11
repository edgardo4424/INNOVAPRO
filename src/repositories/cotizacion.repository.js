const { Cotizacion } = require('../models');

exports.create = (data) => Cotizacion.create(data);
exports.findAll = () => Cotizacion.findAll();
