const express = require("express");
const router = express.Router();
const productosServiciosController = require("../controllers/productosServiciosController");

router.get("/", productosServiciosController.obtenerProductosServicios);
router.get("/:id", productosServiciosController.obtenerProductoServicioPorId);
router.post("/", productosServiciosController.crearProductoServicio);
router.put("/:id", productosServiciosController.actualizarProductoServicio);
router.delete("/:id", productosServiciosController.eliminarProductoServicio);

module.exports = router;