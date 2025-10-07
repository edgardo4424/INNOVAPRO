const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

const { verificarToken } = require('../../../../shared/middlewares/authMiddleware')

router.use(verificarToken)

// 📌 Rutas de clientes (protegidas por token desde index.js)
router.get("/", clienteController.obtenerClientesContactosObras);
router.get("/id-contactos-obras", clienteController.obtenerClientes);
router.get("/:id", clienteController.obtenerClientePorId);
router.post("/", clienteController.crearCliente);
router.put("/:id", clienteController.actualizarCliente);
router.delete("/:id", clienteController.eliminarCliente);

module.exports = router;