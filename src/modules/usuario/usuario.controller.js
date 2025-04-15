const {
  crearUsuario,
  obtenerUsuarios,
  loginUsuario,
  regenerarTokenCondicional,
  actualizarUsuario,
  obtenerUnUsuario,
  eliminarUsuario,
} = require("./usuario.usecase");
const jwt = require("jsonwebtoken");

// ✅ usa importación directa del módulo
const zod = require("zod");
const { usuarioCreateSchema, usuarioUpdateSchema, usuarioAuthSchema } = require("./usuario.schema");
const { resSuccess, resError } = require("../../utils/response");

// 📦 Controlador para crear un usuario
exports.crear = async (req, res, next) => {
  try {
    // ✅ Validar el cuerpo del request
    const data = usuarioCreateSchema.parse(req.body);

    // 🧠 Lógica de negocio en el use-case
    const usuario = await crearUsuario(data);

    // Enviar la respuesta con una estructura establecida
    return resSuccess({
      res,
      message: "Usuario agregado correctamente",
      data: usuario,
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

exports.obtenerTodos = async (req, res, next) => {
  try {
    console.log('get usuarios');
    const lista = await obtenerUsuarios();

    return resSuccess({
      res,
      message: "Lista de usuarios",
      data: lista,
      statusCode: 200,
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};

exports.obtenerUno = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usuario = await obtenerUnUsuario({id});
    return resSuccess({
      res,
      message: "Información del usuario",
      data: usuario,
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
    const data = usuarioUpdateSchema.parse(req.body);

    const usuario = await actualizarUsuario({id, data});

    return resSuccess({
      res,
      message: "Usuario actualizado correctamente",
      data: usuario,
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

exports.login = async (req, res, next) => {
  try {

     // ✅ Validar el cuerpo del request
     const data = usuarioAuthSchema.parse(req.body);

     console.log({data});
    const token = await loginUsuario(data);
    return resSuccess({
      res,
      message: "Inicio de sesión exitoso",
      data: { token },
      statusCode: 200,
    });
  } catch (error) {
    
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return resError({res, message: "Token requerido", statusCode: 401})

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await regenerarTokenCondicional(decoded);
    if (result) {
      return resSuccess({res, message: 'Token actualizado', data: {token: result}, statusCode:200})
    } else {
      return resSuccess({res, message: 'Se conserva el mismo token', data: {token}, statusCode:200})
    }
  } catch (error) {
    next(error);
  }
};

