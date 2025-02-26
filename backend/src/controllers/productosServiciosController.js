const db = require("../models");
const ProductoServicio = db.ProductoServicio;
const EmpresaProveedora = db.empresas_proveedoras;

// 🔹 Obtener todos los productos/servicios con opción de filtrar por empresa proveedora
exports.obtenerProductosServicios = async (req, res) => {
    try {
        const { empresa_id } = req.query;

        let whereCondition = {};
        if (empresa_id) {
            whereCondition = { id: empresa_id };
        }

        const productos = await ProductoServicio.findAll({
            include: [
                {
                    model: EmpresaProveedora,
                    as: "empresas",
                    where: whereCondition,
                    through: { attributes: [] } // Evita mostrar la tabla intermedia
                }
            ]
        });

        res.status(200).json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos/servicios:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener un producto/servicio por ID
exports.obtenerProductoServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await ProductoServicio.findByPk(id, {
            include: {
                model: EmpresaProveedora,
                as: "empresas",
                through: { attributes: [] }
            }
        });

        if (!producto) {
            return res.status(404).json({ error: "Producto/Servicio no encontrado" });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error("❌ Error al obtener producto/servicio:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo producto/servicio
exports.crearProductoServicio = async (req, res) => {
    try {
        const { nombre, descripcion, tipo, atributos, empresas } = req.body;

        if (!nombre || !tipo || !empresas || empresas.length === 0) {
            return res.status(400).json({ mensaje: "Nombre, tipo y al menos una empresa proveedora son obligatorios." });
        }

        const transaction = await ProductoServicio.sequelize.transaction();
        try {
            const nuevoProducto = await ProductoServicio.create({
                nombre,
                descripcion,
                tipo,
                atributos
            }, { transaction });

            // 🔥 Verificar si `setEmpresas_proveedoras` realmente existe
            if (nuevoProducto.setEmpresas) {
                await nuevoProducto.setEmpresas(empresas, { transaction });
              } else {
                console.error("❌ Error: setEmpresas no está definido en el modelo.");
            }

            // Asociar con empresas proveedoras
            await nuevoProducto.setEmpresas(empresas, { transaction });

            await transaction.commit();
            res.status(201).json({ mensaje: "✅ Producto/Servicio creado con éxito", producto: nuevoProducto });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error("❌ Error al crear producto/servicio:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un producto/servicio
exports.actualizarProductoServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, tipo, atributos, empresas } = req.body;

        const producto = await ProductoServicio.findByPk(id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto/Servicio no encontrado" });
        }

        const transaction = await ProductoServicio.sequelize.transaction();
        try {
            await producto.update({ nombre, descripcion, tipo, atributos }, { transaction });

            // Actualizar relación con empresas proveedoras
            if (Array.isArray(empresas)) {
                await producto.setEmpresas(empresas, { transaction });
            }

            await transaction.commit();
            res.json({ mensaje: "✅ Producto/Servicio actualizado correctamente", producto });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error("❌ Error al actualizar producto/servicio:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar un producto/servicio
exports.eliminarProductoServicio = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await ProductoServicio.findByPk(id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto/Servicio no encontrado" });
        }

        await producto.destroy();
        res.status(200).json({ mensaje: "✅ Producto/Servicio eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar producto/servicio:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};