const db = require("../models");

// 🔹 Crear una cotización
exports.crearCotizacion = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en el backend:", req.body);
        
        const { empresa_proveedora_id, cliente_id, obra_id, contacto_id, usuario_id, motivo, observaciones, estado } = req.body || {};

        if (!empresa_proveedora_id || !obra_id || !contacto_id || !usuario_id || !motivo) {
            return res.status(400).json({ mensaje: "❌ Todos los campos son obligatorios." });
        }

        const empresa = await db.empresas_proveedoras.findByPk(empresa_proveedora_id);
        const usuario = await db.usuarios.findByPk(usuario_id);
        const obra = await db.obras.findByPk(obra_id);
        const contactoEncontrado = await db.contactos.findByPk(contacto_id, {
            include: { model: db.clientes, as: "cliente" }
        });

        const clienteFinal = contactoEncontrado?.cliente || (cliente_id ? await db.clientes.findByPk(cliente_id) : null);

        if (!empresa || !usuario || !clienteFinal || !obra) {
            return res.status(400).json({
                mensaje: "❌ No se encontraron todos los datos necesarios.",
                detalles: { empresa, usuario, clienteFinal, obra }
            });
        }

        const razonSocialCliente = clienteFinal?.razon_social || "CLIENTE DESCONOCIDO";
        const nombreObra = obra?.nombre || "OBRA DESCONOCIDA";

        const empresaAbv = empresa.nombre.split(" ").map(word => word[0].toUpperCase()).join("");
        const usuarioIniciales = usuario.nombre.split(" ").map(word => word[0].toUpperCase()).join("");
        const numeroCotizacion = await db.cotizaciones.count() + 1;
        const numeroCotizacionFormatted = numeroCotizacion.toString().padStart(4, "0");
        const año = new Date().getFullYear();
        const version = 1;

        const codigo = `${empresaAbv}-COM-${usuarioIniciales}-${numeroCotizacionFormatted}_${version}-${año} ${razonSocialCliente}-${nombreObra} (${motivo})`;

        const nuevaCotizacion = await db.cotizaciones.create({
            codigo,
            empresa_proveedora_id,
            cliente_id: clienteFinal.id,
            obra_id,
            contacto_id,
            usuario_id,
            motivo,
            estado: estado || "Borrador",
            observaciones,
        });

        res.status(201).json({ mensaje: "✅ Cotización creada exitosamente", cotizacion: nuevaCotizacion });
    } catch (error) {
        console.error("❌ Error al crear cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};


// 🔹 Obtener todas las cotizaciones con los datos completos
exports.obtenerCotizaciones = async (req, res) => {
    try {
        const cotizaciones = await db.cotizaciones.findAll({
            include: [
                {model: db.empresas_proveedoras, as: "empresas_proveedoras" },
                {model: db.clientes, as: "clientes" },
                {model: db.obras, as: "obras" },
                {model: db.contactos, as: "contactos"},
                {model: db.usuarios, as: "usuarios"}
            ]
        });

        res.status(200).json({ cotizaciones: cotizaciones || [] }); // 🔥 Siempre devuelve un array, aunque esté vacío
    } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener una cotización por ID
exports.obtenerCotizacionPorId = async (req, res) => {
    try {
        const cotizacion = await db.cotizaciones.findByPk(req.params.id, {
            include: [
                {model: db.empresas_proveedoras, as: "empresas_proveedoras" },
                {model: db.clientes, as: "clientes" },
                {model: db.obras, as: "obras" },
                {model: db.contactos, as: "contactos"},
                {model: db.usuarios, as: "usuarios"}
            ]
        });

        if (!cotizacion) {
            return res.status(404).json({ mensaje: "Cotización no encontrada" });
        }

        res.status(200).json({ cotizacion });
    } catch (error) {
        console.error("❌ Error al obtener cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar una cotización
exports.actualizarCotizacion = async (req, res) => {
    try {
        const { codigo, empresa_proveedora_id, cliente_id, obra_id, contacto_id, usuario_id, observaciones, estado } = req.body;

        const cotizacion = await db.cotizaciones.findByPk(req.params.id);
        if (!cotizacion) {
            return res.status(404).json({ mensaje: "Cotización no encontrada" });
        }

        await cotizacion.update({
            codigo, empresa_proveedora_id, cliente_id, obra_id, contacto_id, usuario_id, observaciones, estado
        });

        res.status(200).json({ mensaje: "Cotización actualizada correctamente", cotizacion });
    } catch (error) {
        console.error("❌ Error al actualizar cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar una cotización
exports.eliminarCotizacion = async (req, res) => {
    try {
        const cotizacion = await db.cotizaciones.findByPk(req.params.id);
        if (!cotizacion) {
            return res.status(404).json({ mensaje: "Cotización no encontrada" });
        }

        await cotizacion.destroy();
        res.status(200).json({ mensaje: "Cotización eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cotización:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Generar PDF de una cotización (PENDIENTE IMPLEMENTACIÓN)
exports.generarPDFCotizacion = async (req, res) => {
    try {
        // Aquí se generará el PDF en una próxima versión
        res.status(200).json({ mensaje: "Funcionalidad de PDF en desarrollo" });
    } catch (error) {
        console.error("❌ Error al generar PDF:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
