const { crearCliente, obtenerClientes, obtenerCotizacionesPorCliente } = require('../use-cases/cliente.usecase');
const { resSuccess } = require('../utils/response');

exports.crear = async (req, res, next) => {
  try {
    const cliente = await crearCliente(req.body);
    return resSuccess({res, message: "Cliente creado correctamente", data:cliente, statusCode: 201})
    
  } catch (error) {
    next(error);
  }
};

exports.obtenerTodos = async (req, res, next) => {
  try {
    const lista = await obtenerClientes();
    return resSuccess({res, message: "Lista de clientes", data: lista, statusCode: 200})
  } catch (error) {
    next(error);
  }
};

exports.obtenerCotizacionesPorCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cotizacionesPorCliente = await obtenerCotizacionesPorCliente(id);
    return resSuccess({res, message: "Lista de cotizaciones por cliente", data: cotizacionesPorCliente, statusCode: 200})
  } catch (error) {
   
    next(error);
  }
};
