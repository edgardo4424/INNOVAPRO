const db = require("../models");

// 🔹 Obtener todos los detalles de cotización
exports.obtenerDetalles = async (req, res) => {
    try {
        const detalles = await db.CotizacionDetalle.findAll();
        res.status(200).json(detalles);
    } catch (error) {
        console.error("❌ Error al obtener detalles de cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener detalles de una cotización específica
exports.obtenerDetallesPorCotizacion = async (req, res) => {
    try {
        const { cotizacionId } = req.params;
        if (!cotizacionId) return res.status(400).json({ mensaje: "Cotización ID es requerido" });

        const detalles = await db.CotizacionDetalle.findAll({ where: { cotizacion_id: cotizacionId } });
        res.status(200).json(detalles);
    } catch (error) {
        console.error("❌ Error al obtener detalles de la cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo detalle de cotización
exports.crearDetalle = async (req, res) => {
    try {
        const { cotizacion_id, servicio, cantidad, unidad, precio_unitario } = req.body;

        if (!cotizacion_id || !servicio || !cantidad || !unidad || !precio_unitario) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        const total = cantidad * precio_unitario;

        const nuevoDetalle = await db.CotizacionDetalle.create({
            cotizacion_id, servicio, cantidad, unidad, precio_unitario, total
        });

        res.status(201).json({ mensaje: "Detalle de cotización creado exitosamente", detalle: nuevoDetalle });
    } catch (error) {
        console.error("❌ Error al crear detalle de cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un detalle de cotización
exports.actualizarDetalle = async (req, res) => {
    try {
        const { servicio, cantidad, unidad, precio_unitario } = req.body;
        const detalle = await db.CotizacionDetalle.findByPk(req.params.id);

        if (!detalle) return res.status(404).json({ mensaje: "Detalle de cotización no encontrado" });

        const total = cantidad * precio_unitario;

        await detalle.update({ servicio, cantidad, unidad, precio_unitario, total });
        res.status(200).json({ mensaje: "Detalle de cotización actualizado correctamente", detalle });
    } catch (error) {
        console.error("❌ Error al actualizar detalle de cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar un detalle de cotización
exports.eliminarDetalle = async (req, res) => {
    try {
        const detalle = await db.CotizacionDetalle.findByPk(req.params.id);
        if (!detalle) return res.status(404).json({ mensaje: "Detalle de cotización no encontrado" });

        await detalle.destroy();
        res.status(200).json({ mensaje: "Detalle de cotización eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar detalle de cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};