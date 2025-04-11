const { Modulo } = require('../models');

exports.create = (data) => Modulo.create(data);
exports.findAll = () => Modulo.findAll();
