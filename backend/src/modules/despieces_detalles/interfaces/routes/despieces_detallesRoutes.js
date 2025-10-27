const express = require("express");
const router = express.Router();
const despiecesDetallesController = require("../controllers/despiecesDetallesController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

// 📌 Rutas protegidas solo para Gerencia
router.get("/", despiecesDetallesController.obtenerDespiecesDetalle);
router.post("/", despiecesDetallesController.crearDespieceDetalle);
router.put("/actualizar-despiece",despiecesDetallesController.actualizarDespieceDetalleCotizacion);
router.put("/:id", despiecesDetallesController.actualizarDespieceDetalle);
router.put("/:id/actualizarPiezas", despiecesDetallesController.actulizarDespiecePP);
router.delete("/:id", despiecesDetallesController.eliminarDespieceDetalle);
router.post("/varios", despiecesDetallesController.crearVariosDespiecesDetalles); // inserta varias piezas en la tabla despieces_detalles
module.exports = router;