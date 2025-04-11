const jwt = require("jsonwebtoken");

/**
 * Genera un token JWT con los datos del usuario
 * @param {Object} payload - Datos a incluir en el token
 * @param {string} [expiresIn='1h'] - Tiempo de expiración
 * @returns {string} token firmado
 */
const generarToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = {
  generarToken,
};
