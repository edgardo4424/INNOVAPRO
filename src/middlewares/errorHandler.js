const { resError } = require("../utils/response");

// 📁 src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("❌ Error capturado:", err);

  // ✅ Si el error personalizado tiene statusCode, usarlo directamente
  if (err.statusCode && err.message) {
    return resError({ res, message: err.message, statusCode: err.statusCode });
  }

  // Sequelize errores comunes
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return resError({
      res,
      message:
        "Error de clave foránea. Verifique que los IDs relacionados existan.",
      statusCode: 400,
    });
    /* detalle: err.parent?.sqlMessage || err.message */
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return resError({
      res,
      message: "Datos duplicados. Un campo que debe ser único ya existe.",
      statusCode: 409,
    });

    /*  campos: err.errors?.map(e => e.path),
        valores: err.errors?.map(e => e.value) */
  }

  if (err.name === "SequelizeValidationError") {
    return resError({
      res,
      message: "Error de validación en los datos enviados.",
      statusCode: 400,
    });

    /*  errores: err.errors?.map(e => ({ campo: e.path, mensaje: e.message })) */
  }

  if (err.name === "SequelizeDatabaseError") {
    return resError({
      res,
      message: "Error al ejecutar consulta SQL.",
      statusCode: 500,
    });
  }

  // Fallback para errores no manejados
  return resError({
    res,
    message: "Error interno del servidor",
    statusCode: 500,
  });

  /* detalle: err.message */
};
