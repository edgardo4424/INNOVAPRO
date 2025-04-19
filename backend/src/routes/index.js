const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");

const { registerModuleRoutes } = require("../../scripts/registerModuleRoutes");

const sunatRoutes = require("./sunatRoutes");

// 📌 Rutas públicas
router.use("/auth", require("./authRoutes"));  
router.use("/sunat", sunatRoutes); // 🔥 Ruta para pruebas de importación SUNAT

// 📌 PROTEGER RUTAS DESPUÉS DEL LOGIN
if (process.env.NODE_ENV !== "development") {
    router.use(verificarToken);
}

// Cargar dinámicamente rutas de módulos con Clean Architecture
registerModuleRoutes(router, null); // Ya protegemos globamente con el middleware verificarToken

// Rutas aun no refactorizadas a Clean Architecture
router.use("/contactos", require("./contactoRoutes"));
router.use("/cotizaciones", require("./cotizaciones"));
router.use("/productos-servicios", require("./productosServiciosRoutes"));
router.use("/notificaciones", require("./notificacionesRoutes"));
router.use("/tareas", require("./tareasRoutes"));
router.use("/ruc", require("./rucRoutes"));

module.exports = router;