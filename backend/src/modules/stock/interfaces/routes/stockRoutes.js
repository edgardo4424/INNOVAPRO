const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", stockController.obtenerStockPiezasPorEstado); //Listado de los tipos piezas con su stock fijo disponible, items cotizados, items en contrato
router.get("/:id", stockController.obtenerStockPorId);   



router.post("/", stockController.crearStock);//crea el primer registro de stock para una pieza y registra los dos movimientos inciales


router.put("/disponible", stockController.actualizarStockDisponible); 
router.put("/fijo", stockController.actualizarStockFijo); 

module.exports = router;
