const moduloRepository = require('../repositories/modulo.repository');

exports.crearCotizacion = async (data) => moduloRepository.create(data);
exports.obtenerModulos = async () => moduloRepository.findAll();
