/**
 * ✅ Respuesta estándar para peticiones exitosas
 * @param {object} res - response de Express
 * @param {string} message - mensaje para el frontend
 * @param {object|null} data - datos de respuesta (opcional)
 * @param {number} statusCode - código HTTP (por defecto 200)
 *
 * 📌 Cómo usar en un controlador:
 *   const { resSuccess } = require('../utils/response');
 *   return resSuccess(res, 'Usuario creado exitosamente', usuario, 201);
 */
const resSuccess = ({
  res,
  message = "Operación exitosa",
  data = null,
  statusCode = 200,
}) => {
  
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
    errors: null,
  });
};

/**
 * ❌ Respuesta estándar para errores controlados
 * @param {object} res - response de Express
 * @param {string} message - mensaje claro para el usuario
 * @param {array|null} errors - lista de errores detallados
 * @param {number} statusCode - código HTTP (por defecto 400)
 *
 * 📌 Cómo usar en un controlador:
 *   const { resError } = require('../utils/response');
 *   return resError(res, 'Error de validación', [ { campo: 'email', mensaje: 'Inválido' } ]);
 */
const resError = ({
  res,
  message = "Ocurrió un error",
  errors = null,
  statusCode = 400,
}) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    data: null,
    errors,
  });
};

module.exports = {
  resSuccess,
  resError,
};
