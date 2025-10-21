const jwt = require("jsonwebtoken");
const db = require("../../database/models");

// 🔹 Middleware para verificar token
async function verificarToken(req, res, next) {


  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado" });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await db.usuarios.findByPk(verificado.id, {
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
          include: [
            {
              model: db.cargos,
              as: "cargo",
            },
          ],
        },
      ],
    });

    const usuarioVerificado = {
      id: usuario.id,
      email: usuario.email,
      id_chat: usuario.id_chat,
      rol: usuario.trabajador?.cargo?.nombre,
      nombre: usuario.trabajador?.nombres+" "+usuario.trabajador?.apellidos
    }

    if (!usuarioVerificado) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    req.usuario = usuarioVerificado;

    next();
  } catch (error) {
    console.log("🔴 Token inválido:", error);
    res.status(417).json({ mensaje: "Token no válido" });
  }
}

module.exports = { verificarToken };