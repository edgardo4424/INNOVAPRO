const db = require("../models");

// 🔹 Crear una cotización
exports.crearCotizacion = async (req, res) => {
    try {
        
        const { empresa_proveedora_id, contacto_id, usuario_id, motivo, observaciones, estado, productos, descuento } = req.body || {};

        if (!empresa_proveedora_id || !contacto_id || !usuario_id || !motivo || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ mensaje: "❌ Todos los campos son obligatorios, incluyendo al menos un producto o servicio." });
        }        

        // Obtener datos necesarios

        const empresa = await db.empresas_proveedoras.findByPk(empresa_proveedora_id);
        const usuario = await db.usuarios.findByPk(usuario_id);
        const contacto = await db.contactos.findByPk(contacto_id, {
            include: [{ model: db.clientes, as: "cliente" }, { model: db.obras, as: "obra" }]
        });

        if (!empresa || !usuario || !contacto || !contacto.obra) {
            return res.status(400).json({
                mensaje: "❌ No se encontraron todos los datos necesarios.",
                detalles: { empresa, usuario, contacto }
            });
        }

        // Obtener cliente y obra desde el contacto
        const cliente = contacto.cliente;
        const obra = contacto.obra;

        // Generación del código incremental por empresa proveedora
        const numeroCotizacion = await db.cotizaciones.count({
            where: { empresa_proveedora_id }
        }) + 1;        
        const numeroCotizacionFormatted = numeroCotizacion.toString().padStart(4, "0");
        const año = new Date().getFullYear();
        const version = 1;

        // Formato del código de cotización
        const razonSocialCliente = cliente.razon_social || "CLIENTE DESCONOCIDO";
        const nombreObra = obra.nombre || "OBRA DESCONOCIDA";
        const empresaAbv = empresa.nombre.split(" ").map(word => word[0].toUpperCase()).join("");
        const usuarioIniciales = usuario.nombre.split(" ").map(word => word[0].toUpperCase()).join("");
        

        const codigo = `${empresaAbv}-COM-${usuarioIniciales}-${numeroCotizacionFormatted}_${version}-${año} ${razonSocialCliente}-${nombreObra} (${motivo})`;

        // Definir estado si hay descuento
        let estadoFinal = estado || "Borrador";
        if (descuento && descuento > 0) {
            estadoFinal = "Pendiente de aprobación"; // Si hay descuento, debe aprobarse
        }

        const nuevaCotizacion = await db.cotizaciones.create({
            codigo,
            empresa_proveedora_id,
            contacto_id,
            usuario_id,
            descuento,
            motivo,
            estado: estadoFinal,
            observaciones,
        });

        // Asociar productos/servicios a la cotización
        if (productos && productos.length > 0) {
            for (const prod of productos) {
                await db.cotizacion_detalles.create({
                    cotizacion_id: nuevaCotizacion.id,
                    producto_servicio_id: prod.id,
                    cantidad: prod.cantidad || 1,
                    parametros: JSON.stringify(prod.parametros || {})
                });
            }
        }

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
                {model: db.empresas_proveedoras, as: "empresa_proveedora" },
                { model: db.contactos, as: "contacto", 
                    include: [
                        { model: db.clientes, as: "clientes_asociados" }, 
                        { model: db.obras, as: "obras_asociadas" }
                    ] },
                {model: db.usuarios, as: "usuario"}
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
                { model: db.contactos, as: "contacto", 
                    include: [
                        { model: db.clientes, as: "clientes_asociados" }, 
                        { model: db.obras, as: "obras_asociadas" }
                    ] },
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
        const { codigo, empresa_proveedora_id, contacto_id, usuario_id, observaciones, estado, productos, descuento } = req.body;

        const cotizacion = await db.cotizaciones.findByPk(req.params.id);
        if (!cotizacion) {
            return res.status(404).json({ mensaje: "Cotización no encontrada" });
        }

        // Obtener contacto, cliente y obra desde el nuevo contacto seleccionado
        const contacto = await db.contactos.findByPk(contacto_id, {
            include: [{ model: db.clientes, as: "cliente" }, { model: db.obras, as: "obra" }]
        });

        if (!contacto || !contacto.cliente || !contacto.obra) {
            return res.status(400).json({
                mensaje: "❌ No se encontraron los datos del contacto, cliente u obra.",
                detalles: { contacto }
            });
        }

        // Eliminar productos anteriores y agregar los nuevos
        await db.cotizacion_detalles.destroy({ where: { cotizacion_id: cotizacion.id } });

        if (productos && productos.length > 0) {
            for (const prod of productos) {
                await db.cotizacion_detalles.create({
                    cotizacion_id: cotizacion.id,
                    producto_servicio_id: prod.id,
                    cantidad: prod.cantidad || 1,
                    parametros: JSON.stringify(prod.parametros || {})
                });
            }
        }

        // Definir estado si hay descuento
        let estadoFinal = estado || "Borrador";
        if (descuento && descuento > 0) {
            estadoFinal = "Pendiente de aprobación"; // Si hay descuento, debe aprobarse
        }

        // Actualizar la cotización
        await cotizacion.update({
            codigo,
            empresa_proveedora_id,
            contacto_id,
            usuario_id,
            estado: estadoFinal,
            observaciones,
            descuento
        });

        res.status(200).json({ mensaje: "✅ Cotización actualizada correctamente", cotizacion });
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

        // Eliminar detalles antes de eliminar la cotización
        await db.cotizacion_detalles.destroy({ where: { cotizacion_id: cotizacion.id } });

        await cotizacion.destroy();
        res.status(200).json({ mensaje: "✅ Cotización eliminada correctamente" });
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
