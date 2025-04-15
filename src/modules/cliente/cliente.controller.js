const { crearCliente, obtenerClientes, obtenerUnCliente, actualizarCliente, eliminarCliente } = require('./cliente.usecase');
const { resSuccess } = require('./../../utils/response');

exports.crear = async (req, res, next) => {
  try {

     // ✅ Validar el cuerpo del request

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

exports.obtenerUno = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cliente = await obtenerUnCliente({id});
    return resSuccess({
      res,
      message: "Información del cliente",
      data: cliente,
      statusCode: 200,
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
}

exports.actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
   
      // ✅ Validar el cuerpo del request antes de actualizar



    const cliente = await actualizarCliente({id, data: req.body});

    return resSuccess({
      res,
      message: "Cliente actualizado correctamente",
      data: cliente,
      statusCode: 201,
    });
  } catch (error) {
   
    next(error);
  }
};

exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // fueEliminado es un boolean (true o false)
    const fueEliminado = await eliminarCliente({id});

    if(fueEliminado){
      return resSuccess({
        res,
        message: "Cliente eliminado",
        statusCode: 200,
      });
    }else{
      return resError({
        res,
        message: "Error, cliente no encontrado",
        statusCode: 404,
      });
    }
    
  } catch (error) {
    console.log('error', error);
    next(error);
  }
}