const express = require("express");
const router = express.Router();

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");


// router.use(verificarToken); // Verificamos el token y el rol de Gerente para as las rutas

// ?? TRANSPORTE
router.post("/", (req, res) => {
    res.send("hola");
});

module.exports = router;
