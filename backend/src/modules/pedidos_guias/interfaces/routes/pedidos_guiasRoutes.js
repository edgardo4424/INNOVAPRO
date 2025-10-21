const express = require("express");
const router = express.Router();
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas




module.exports = router;