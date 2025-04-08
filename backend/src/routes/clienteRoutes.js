const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clientes/clienteController");

// 📌 Rutas de clientes (protegidas por token desde index.js)
router.get("/", clienteController.obtenerClientes);
router.get("/:id", clienteController.obtenerClientePorId);
router.post("/", clienteController.crearCliente);
router.put("/:id", clienteController.actualizarCliente);
router.delete("/:id", clienteController.eliminarCliente);

module.exports = router;