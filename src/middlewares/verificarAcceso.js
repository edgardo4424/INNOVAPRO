const usuarioRepository = require("../modules/usuario/usuario.repository");
const jwt = require("jsonwebtoken");
const { resError } = require("../utils/response");
const { CODIGO_ROL_GERENTE_GENERAL } = require("../constants/codigos_roles");

// 🛡️ Middleware para verificar el permiso
const verificarAcceso = async (req, res, next) => {
    try {
        const usuarioId = req.user.id; // Asumiendo que el ID del usuario está en req.user.id después de verificar el token
        const codigoModulo = req.headers["codigo-modulo"]; // Código del módulo enviado en el encabezado
    
        if (!codigoModulo) {
          return res
            .status(400)
            .json({ message: "Código de módulo no proporcionado" });
        }
        
        // Si es gerente general, tiene acceso a todo
        if (usuarioId == CODIGO_ROL_GERENTE_GENERAL) {
          return next();
        }
    
        // Si es otro rol, verificar si tiene el permiso
        const modulos = await usuarioRepository.findModulesByUserId(usuarioId)
    
        //const userModules = user.Role.Modules.map((module) => module.code);
        console.log(modulos);
       
        /* const hasAccess = userModules.includes(moduleCode);
        if (!hasAccess) {
          return res.status(403).json({ message: "Acceso denegado al módulo" });
        } */
    
        next();
      } catch (error) {
        console.log("error", error);
        return res
          .status(500)
          .json({ message: "Error al verificar acceso al módulo" });
      }
};

module.exports = {
  verificarAcceso,
};
