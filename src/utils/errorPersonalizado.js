/**
 * Crea un error personalizado compatible con Express
 * @param {string} message - Mensaje de error que se mostrará al cliente
 * @param {number} statusCode - Código HTTP (por defecto 400 - Bad Request)
 * @returns {Error} Instancia de Error con statusCode
 */

const ErrorPersonalizado = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { ErrorPersonalizado };