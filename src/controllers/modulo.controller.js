const { crearModulo, obtenerModulos } = require('../use-cases/modulo.usecase');
const { resSuccess } = require('../utils/response');

exports.crear = async (req, res, next) => {
  try {
    const modulo = await crearModulo(req.body);
    return resSuccess({res, message: "Módulo creado correctamente", data: modulo, statusCode: 201})
  } catch (error) {
    next(error);
  }
};

exports.obtenerTodas = async (req, res, next) => {
  try {
    const lista = await obtenerModulos();
    return resSuccess({res, message: "Lista de módulos", data: lista, statusCode: 200})
  } catch (error) {
    next(error);
  }
};
