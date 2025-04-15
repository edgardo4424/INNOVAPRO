const {
  crearCliente,
  obtenerUnCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerClientesConSusContactos,
} = require("./cliente.usecase");
const { resSuccess } = require("./../../utils/response");
const {
  clienteCreateSchema,
  clienteUpdateSchema,
} = require("./cliente.schema");

exports.crear = async (req, res, next) => {
  try {
    // ✅ Validar el cuerpo del request

    const data = clienteCreateSchema(req.body);

    const cliente = await crearCliente(data);
    return resSuccess({
      res,
      message: "Cliente creado correctamente",
      data: cliente,
      statusCode: 201,
    });
  } catch (error) {
    // Si el error es por clave única duplicada
    if (error.name === "SequelizeUniqueConstraintError") {
      const camposDuplicados = error.errors.map((err) => err.path); // Extrae el campo duplicado
      let mensaje = "Error: ";

      // Evitamos duplicado de datos únicos
      if (camposDuplicados.includes("dni")) {
        mensaje += "El DNI ingresado ya está registrado. ";
      }
      if (camposDuplicados.includes("dni_representante")) {
        mensaje += "El DNI ingresado ya está registrado. ";
      }
      if (camposDuplicados.includes("ruc")) {
        mensaje += "El RUC ingresado ya está registrado. ";
      }
      if (camposDuplicados.includes("email")) {
        mensaje += "El Correo ingresado ya está registrado. ";
      }

      return res.status(400).json({ mensaje: mensaje.trim() });
    }

    next(error);
  }
};

exports.obtenerTodos = async (req, res, next) => {
  try {
    const lista = await obtenerClientesConSusContactos();
    return resSuccess({
      res,
      message: "Lista de clientes",
      data: lista,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

exports.obtenerUno = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cliente = await obtenerUnCliente({ id });
    return resSuccess({
      res,
      message: "Información del cliente",
      data: cliente,
      statusCode: 200,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

exports.actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ Validar el cuerpo del request antes de actualizar
    const data = clienteUpdateSchema(req.body);

    // transformar la data antes de actualizar
    const dataParaActualizar = entidadService.construirEntidadData(data);

    const cliente = await actualizarCliente({ id, data: dataParaActualizar });

    return resSuccess({
      res,
      message: "Cliente actualizado correctamente",
      data: cliente,
      statusCode: 200,
    });
  } catch (error) {
    // ✅ Capturar errores de clave única duplicada
    if (error.name === "SequelizeUniqueConstraintError") {
      const camposDuplicados = error.errors.map((err) => err.path);
      let mensaje = "Error: ";

      if (camposDuplicados.includes("dni")) {
        mensaje += "El DNI ingresado ya está registrado. ";
      }
      if (camposDuplicados.includes("dni_representante")) {
        mensaje += "El DNI del representante ya está registrado. ";
      }
      if (camposDuplicados.includes("ruc")) {
        mensaje += "El RUC ingresado ya está registrado. ";
      }
      if (camposDuplicados.includes("email")) {
        mensaje += "El Correo ingresado ya está registrado. ";
      }

      return res.status(400).json({ mensaje: mensaje.trim() });
    }

    next(error);
  }
};

exports.eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // fueEliminado es un boolean (true o false)
    const fueEliminado = await eliminarCliente({ id });

    if (fueEliminado) {
      return resSuccess({
        res,
        message: "Cliente eliminado",
        statusCode: 200,
      });
    } else {
      return resError({
        res,
        message: "Error, cliente no encontrado",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
