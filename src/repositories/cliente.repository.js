const { Cliente, Cotizacion } = require('../models');

exports.create = (data) => Cliente.create(data);
exports.findAll = () => Cliente.findAll();
exports.findCotizacionesByClienteId = (clienteId) => Cliente.findByPk(clienteId, { include: Cotizacion });
