const { crearContacto, obtenerContactos, obtenerUnContacto } = require('./contacto.usecase');
const { resSuccess } = require('../../utils/response');

exports.crear = async (req, res, next) => {
  try {

     // ✅ Validar el cuerpo del request


    const contacto = await crearContacto(req.body);
    return resSuccess({res, message: "Contacto creado correctamente", data:contacto, statusCode: 201})
    
  } catch (error) {
    next(error);
  }
};

exports.obtenerTodos = async (req, res, next) => {
  try {
    const lista = await obtenerContactos();
    return resSuccess({res, message: "Lista de contactos", data: lista, statusCode: 200})
  } catch (error) {
    next(error);
  }
};

exports.obtenerUno = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contacto = await obtenerUnContacto({id});
    return resSuccess({
      res,
      message: "Información del contacto",
      data: contacto,
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


    const contacto = await actualizarContacto({id, data});

    return resSuccess({
      res,
      message: "Contacto actualizado correctamente",
      data: contacto,
      statusCode: 201,
    });
  } catch (error) {
    // 🚨 Si el error es de Zod, devolver los campos faltantes o inválidos en una sola línea
    if (error instanceof zod.ZodError) {
      const errores = error.errors.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      }));
      return resError({
        res,
        message: "Error de validación",
        errors: errores,
        statusCode: 400,
      });
    }
    next(error);
  }
};

exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // fueEliminado es un boolean (true o false)
    const fueEliminado = await eliminarUsuario({id});

    if(fueEliminado){
      return resSuccess({
        res,
        message: "Usuario eliminado",
        statusCode: 200,
      });
    }else{
      return resError({
        res,
        message: "Error, usuario no encontrado",
        statusCode: 404,
      });
    }
    
  } catch (error) {
    console.log('error', error);
    next(error);
  }
}