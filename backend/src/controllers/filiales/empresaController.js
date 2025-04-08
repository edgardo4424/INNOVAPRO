const db = require("../../models");

// 🔹 Obtener todas las empresas proveedoras
exports.obtenerEmpresas = async (req, res) => {
    try {
        const empresas = await db.empresas_proveedoras.findAll({ raw: true });
        res.status(200).json(empresas);
    } catch (error) {
        console.error("❌ Error al obtener empresas proveedoras:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener una empresa por ID
exports.obtenerEmpresaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await db.empresas_proveedoras.findByPk(id);
        if (!empresa) return res.status(404).json({ mensaje: "Empresa no encontrada" });

        res.status(200).json(empresa);
    } catch (error) {
        console.error("❌ Error al obtener empresa proveedora:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear una empresa proveedora
exports.crearEmpresa = async (req, res) => {
    try {
        const { razon_social, ruc, direccion, representante_legal, dni_representante, cargo_representante, telefono_representante, telefono_oficina, creado_por } = req.body;

        // Validar si ya existe una empresa con ese RUC
        const existe = await db.empresas_proveedoras.findOne({ where: { ruc } });
        if (existe) {
            return res.status(400).json({ mensaje: "El RUC ingresado ya está registrado en otra empresa proveedora." });
        }

        const nuevaEmpresa = await db.empresas_proveedoras.create({
            razon_social,
            ruc,
            direccion,
            representante_legal,
            dni_representante,
            cargo_representante,
            telefono_representante,
            telefono_oficina: telefono_oficina || null,
            creado_por
        });
        res.status(201).json(nuevaEmpresa);
    } catch (error) {
        console.error("❌ Error al crear empresa proveedora:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Modificar una empresa
exports.actualizarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await db.empresas_proveedoras.findByPk(id);
        if (!empresa) return res.status(404).json({ mensaje: "Empresa no encontrada" });

         // 🔒 Validar si el nuevo RUC ya está en uso por otra empresa
         if (ruc) {
            const empresaExistente = await db.empresas_proveedoras.findOne({
                where: {
                    ruc,
                    id: { [db.Sequelize.Op.ne]: id } // Excluye la empresa actual
                }
            });

            if (empresaExistente) {
                return res.status(400).json({ mensaje: "El RUC ingresado ya está registrado en otra empresa." });
            }
        }

        await empresa.update(req.body);
        res.status(200).json(empresa);
    } catch (error) {
        console.error("❌ Error al modificar empresa:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Eliminar una empresa
exports.eliminarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await db.empresas_proveedoras.findByPk(id);
        if (!empresa) return res.status(404).json({ mensaje: "Empresa no encontrada" });

        await empresa.destroy();
        res.status(200).json({ mensaje: "Empresa eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar empresa:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};