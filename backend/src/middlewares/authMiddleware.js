const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");

async function validarCaptcha(token) {
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  return response.data.success;
}

// 🔹 Middleware para verificar token (💀 ESTO FALTABA)
function verificarToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token no válido" });
  }
}

// 🔹 Middleware para verificar si el usuario es Gerente
function esGerente(req, res, next) {
  if (!req.usuario || req.usuario.rol !== "Gerencia") {
    return res.status(403).json({ mensaje: "Acceso denegado. Se requiere rol de Gerente." });
  }
  next();
}

module.exports = { validarCaptcha, verificarToken, esGerente };