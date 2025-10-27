const express = require("express");
const router = express.Router();
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const PedidoGuiaController = require("../controllers/pedidoGuiaController");

router.use(verificarToken); // Verificamos el token para todas las rutas


router.post("/",PedidoGuiaController.crearEnvioPedido)

module.exports = router;