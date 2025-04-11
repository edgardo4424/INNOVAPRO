const { crearCotizacion, obtenerCotizaciones } = require('../use-cases/cotizacion.usecase');
const { resSuccess } = require('../utils/response');

exports.crear = async (req, res, next) => {
  try {
    const cotizacion = await crearCotizacion(req.body);
    return resSuccess({res, message: "Cotización creado correctamente", data:cotizacion, statusCode: 201})
   
  } catch (error) {
    next(error);
  }
};

exports.obtenerTodas = async (req, res, next) => {
  try {
    const lista = await obtenerCotizaciones();
    return resSuccess({res, message: "Lista de cotizaciones", data:lista, statusCode: 200})
  } catch (error) {
    next(error);
  }
};
