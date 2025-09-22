// 🔹 Middleware dinámico: permite uno o varios roles
function tieneRol(rolesPermitidos = ["Administracion", "Gerencia"]) {
    return (req, res, next) => {
      if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "Acceso denegado. Permisos insuficientes." });
      }
      next();
    };
  }
  
  // 🔹 Middleware específico para Gerencia
  function esGerente(req, res, next) {
    console.log('req.usuario', req.usuario);
    if (!req.usuario || req.usuario.rol !== "CEO") {
      return res.status(403).json({ mensaje: "Acceso denegado. Se requiere rol de Gerente." });
    }
    next();
  }
  
  module.exports = { tieneRol, esGerente };  