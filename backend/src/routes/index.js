const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const jwt = require("jsonwebtoken");
const { verificarToken, esGerente } = require("../middlewares/authMiddleware");
const clienteController = require("../controllers/clienteController");
const empresaController = require("../controllers/empresaController");
const obraController = require("../controllers/obraController");
const contactoController = require("../controllers/contactoController");
const cotizacionController = require("../controllers/cotizacionController");
const cotizacionDetalleController = require("../controllers/cotizacionDetalleController");
const productosServiciosRoutes = require("./productosServiciosRoutes");

router.use("/productos-servicios", productosServiciosRoutes);

// Ruta para verificar si el token es válido
router.get("/verify-session", verificarToken, (req, res) => {
    res.json({ valid: true });
});

// 📌 RUTA DE LOGIN (NO REQUIERE TOKEN)
router.post("/login", usuarioController.login);

// 📌 PROTEGER RUTAS DESPUÉS DEL LOGIN
router.use(verificarToken); // 🔥 SOLO SE APLICA DESPUÉS DEL LOGIN

// 🔹 Rutas de Usuarios (Solo Gerencia puede acceder)
if (usuarioController.obtenerUsuarios) router.get("/usuarios", esGerente, usuarioController.obtenerUsuarios);
if (usuarioController.crearUsuario) router.post("/usuarios", esGerente, usuarioController.crearUsuario);
if (usuarioController.modificarRolUsuario) router.put("/usuarios/:id", esGerente, usuarioController.modificarRolUsuario);
if (usuarioController.eliminarUsuario) router.delete("/usuarios/:id", esGerente, usuarioController.eliminarUsuario);

// 🔹 Rutas de Clientes
if (clienteController.obtenerClientes) router.get("/clientes", clienteController.obtenerClientes);
if (clienteController.obtenerClientePorId) router.get("/clientes/:id", clienteController.obtenerClientePorId);
if (clienteController.crearCliente) router.post("/clientes", clienteController.crearCliente);
if (clienteController.actualizarCliente) router.put("/clientes/:id", clienteController.actualizarCliente);
if (clienteController.eliminarCliente) router.delete("/clientes/:id", clienteController.eliminarCliente);

// 🔹 Rutas de Empresas Proveedoras
if (empresaController.obtenerEmpresas) router.get("/empresas_proveedoras", empresaController.obtenerEmpresas);
if (empresaController.obtenerEmpresaPorId) router.get("/empresas_proveedoras/:id", empresaController.obtenerEmpresaPorId);
if (empresaController.crearEmpresa) router.post("/empresas_proveedoras", empresaController.crearEmpresa);
if (empresaController.actualizarEmpresa) router.put("/empresas_proveedoras/:id", empresaController.actualizarEmpresa);
if (empresaController.eliminarEmpresa) router.delete("/empresas_proveedoras/:id", empresaController.eliminarEmpresa);

// 🔹 Rutas de Obras
if (obraController.obtenerObras) router.get("/obras", obraController.obtenerObras);
if (obraController.obtenerObraPorId) router.get("/obras/:id", obraController.obtenerObraPorId);
if (obraController.obtenerObrasPorCliente) router.get("/obras/cliente/:clienteId", obraController.obtenerObrasPorCliente);
if (obraController.crearObra) router.post("/obras", obraController.crearObra);
if (obraController.actualizarObra) router.put("/obras/:id", obraController.actualizarObra);
if (obraController.eliminarObra) router.delete("/obras/:id", obraController.eliminarObra);

// 🔹 Rutas de Contactos
if (contactoController.obtenerContactos) router.get("/contactos", contactoController.obtenerContactos);
if (contactoController.obtenerContactoPorId) router.get("/contactos/:id", contactoController.obtenerContactoPorId);
if (contactoController.obtenerContactosPorObra) router.get("/contactos/obra/:obraId", contactoController.obtenerContactosPorObra);
if (contactoController.crearContacto) router.post("/contactos", contactoController.crearContacto);
if (contactoController.actualizarContacto) router.put("/contactos/:id", contactoController.actualizarContacto);
if (contactoController.eliminarContacto) router.delete("/contactos/:id", contactoController.eliminarContacto);

// 🔹 Rutas de Cotizaciones
if (cotizacionController.obtenerCotizaciones) router.get("/cotizaciones", cotizacionController.obtenerCotizaciones);
if (cotizacionController.obtenerCotizacionPorId) router.get("/cotizaciones/:id", cotizacionController.obtenerCotizacionPorId);
if (cotizacionController.crearCotizacion) router.post("/cotizaciones", cotizacionController.crearCotizacion);
if (cotizacionController.actualizarCotizacion) router.put("/cotizaciones/:id", cotizacionController.actualizarCotizacion);
if (cotizacionController.eliminarCotizacion) router.delete("/cotizaciones/:id", cotizacionController.eliminarCotizacion);

// 🔹 Rutas de Detalles de Cotización
if (cotizacionDetalleController.obtenerDetalles) router.get("/cotizacion_detalles", cotizacionDetalleController.obtenerDetalles);
if (cotizacionDetalleController.obtenerDetallesPorCotizacion) router.get("/cotizacion_detalles/cotizacion/:cotizacionId", cotizacionDetalleController.obtenerDetallesPorCotizacion);
if (cotizacionDetalleController.crearDetalle) router.post("/cotizacion_detalles", cotizacionDetalleController.crearDetalle);
if (cotizacionDetalleController.actualizarDetalle) router.put("/cotizacion_detalles/:id", cotizacionDetalleController.actualizarDetalle);
if (cotizacionDetalleController.eliminarDetalle) router.delete("/cotizacion_detalles/:id", cotizacionDetalleController.eliminarDetalle);

module.exports = router;