const usuarioRepository = require("../repositories/usuario.repository");
const jwt = require("jsonwebtoken");
const { resError } = require("../utils/response");

// 🛡️ Middleware para verificar el token JWT en rutas protegidas
const verificarToken = async (req, res, next) => {
  try {
    // 🧾 Extraer el header de autorización
    const authHeader = req.headers["authorization"];

    // 🚫 Validar que el formato sea "Bearer <token>"
    if (!authHeader?.startsWith("Bearer ")) {
      return resError({res, message: "Formato de token inválido", statusCode: 401})
    }

    // 🔐 Extraer el token después del "Bearer "
    const token = authHeader.split(" ")[1];
    if (!token) return resError({res, message: "Token requerido", statusCode: 401})

    // 🔍 Verificar y decodificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 📦 Buscar el usuario en la base de datos
    const usuario = await usuarioRepository.findById(decoded.id);
    if (!usuario) {
      return resError({res, message: "Usuario no encontrado", statusCode: 404})
    }

    // ✅ Si todo está bien, adjuntar el usuario al request para su uso posterior
    req.usuario = usuario;

    // 🔄 Continuar al siguiente middleware o controlador
    next();

  } catch (error) {
    // ❌ Manejar cualquier error relacionado con el token
    return resError({res, message: "Token inválido", statusCode: 498})
  }
};

module.exports = {
  verificarToken,
};
