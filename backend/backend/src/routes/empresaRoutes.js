const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/filiales/empresaController");

// 📌 Rutas de empresas proveedoras (protegidas por token desde index.js)
router.get("/", empresaController.obtenerEmpresas);
router.get("/:id", empresaController.obtenerEmpresaPorId);
router.post("/", empresaController.crearEmpresa);
router.put("/:id", empresaController.actualizarEmpresa);
router.delete("/:id", empresaController.eliminarEmpresa);

module.exports = router;