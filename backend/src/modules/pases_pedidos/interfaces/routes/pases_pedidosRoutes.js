const express = require("express");
const router = express.Router();
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const PasePedidoController = require("../controllers/pasePedidoControlle");
router.use(verificarToken); // Verificamos el token para todas las rutas

router.get("/",PasePedidoController.obtenerPasesPedidos);
router.post("/",PasePedidoController.crearPasePedido);
router.put("/",PasePedidoController.actualizarPasePedido);
router.put("/update",PasePedidoController.actualizarPasePedidoAutomatico);
router.get("/tv/:fecha",PasePedidoController.obtenerPasesPedidoParaTv);

module.exports = router;
