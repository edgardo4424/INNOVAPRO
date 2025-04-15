const cotizacionRepository = require('./cotizacion.repository');

exports.crearCotizacion = async (data) => cotizacionRepository.create(data);
exports.obtenerCotizaciones = async () => cotizacionRepository.findAll();
