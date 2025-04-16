const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");

const sunatRoutes = require("./sunatRoutes");

const clienteRoutes = require('../modules/clientes/interfaces/routes/clienteRoutes');
const usuarioRoutes = require('../modules/usuarios/interfaces/routes/usuarioRoutes')
const filialesRoutes = require('../modules/filiales/interfaces/routes/filialRoutes')
const obrasRoutes = require('../modules/obras/interfaces/routes/obraRoutes')

// 📌 Rutas públicas
router.use("/auth", require("./authRoutes"));  
router.use("/sunat", sunatRoutes); // 🔥 Ruta para pruebas de importación SUNAT

// 📌 PROTEGER RUTAS DESPUÉS DEL LOGIN

// COMENTAR LA LÍNEA DE ABAJO SOLO PARA HACER PRUEBAS EN POSTMAN
router.use(verificarToken); // 🔥 SOLO SE APLICA DESPUÉS DEL LOGIN

//router.use("/clientes", require("./clienteRoutes"));
router.use('/clientes', clienteRoutes); // Rutas de clientes

router.use("/usuarios", usuarioRoutes);

router.use("/empresas_proveedoras", filialesRoutes);
router.use("/obras", obrasRoutes);
router.use("/contactos", require("./contactoRoutes"));
router.use("/cotizaciones", require("./cotizaciones"));
router.use("/productos-servicios", require("./productosServiciosRoutes"));
router.use("/notificaciones", require("./notificacionesRoutes"));
router.use("/tareas", require("./tareasRoutes"));
router.use("/ruc", require("./rucRoutes"));

module.exports = router;