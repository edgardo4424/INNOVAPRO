const express = require("express");
const { 
    crearCotizacion, 
    obtenerCotizaciones, 
    obtenerCotizacionPorId, 
    actualizarCotizacion, 
    eliminarCotizacion, 
    generarPDFCotizacion 
} = require("../controllers/cotizacionController");

const router = express.Router();

// 🔹 Crear una nueva cotización
router.post("/", crearCotizacion);

// 🔹 Obtener todas las cotizaciones
router.get("/", obtenerCotizaciones);

// 🔹 Obtener una cotización específica por ID
router.get("/:id", obtenerCotizacionPorId);

// 🔹 Actualizar una cotización
router.put("/:id", actualizarCotizacion);

// 🔹 Eliminar una cotización
router.delete("/:id", eliminarCotizacion);

// 🔹 Generar PDF de una cotización
router.post("/generar-pdf", generarPDFCotizacion);

module.exports = router;