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

// 🔹 Obtener cotizaciones filtradas por empresa proveedora
router.get("/empresa/:empresa_proveedora_id", async (req, res) => {
    try {
        const { empresa_proveedora_id } = req.params;
        const cotizaciones = await db.cotizaciones.findAll({
            where: { empresa_proveedora_id },
            include: [
                { model: db.empresas_proveedoras, as: "empresas_proveedoras" },
                { model: db.clientes, as: "clientes" },
                { model: db.obras, as: "obras" },
                { model: db.contactos, as: "contactos" },
                { model: db.usuarios, as: "usuarios" },
            ],
        });
        res.status(200).json({ cotizaciones });
    } catch (error) {
        console.error("❌ Error al obtener cotizaciones por empresa:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// 🔹 Obtener los productos/servicios de una cotización
router.get("/:id/detalles", async (req, res) => {
    try {
        const { id } = req.params;
        const detalles = await db.cotizacion_detalles.findAll({
            where: { cotizacion_id: id },
            include: [{ model: db.productos_servicios, as: "productos_servicios" }],
        });
        res.status(200).json({ detalles });
    } catch (error) {
        console.error("❌ Error al obtener detalles de cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// 🔹 Actualizar una cotización
router.put("/:id", actualizarCotizacion);

// 🔹 Eliminar una cotización
router.delete("/:id", eliminarCotizacion);

// 🔹 Generar PDF de una cotización
router.post("/generar-pdf/:id", generarPDFCotizacion);

module.exports = router;