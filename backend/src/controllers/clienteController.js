const db = require("../models");
const Cliente = db.clientes;
const Contacto = db.contactos; 

// 🔹 Obtener todos los clientes con sus obras y contactos
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            attributes: [
                "id", "razon_social", "tipo", "ruc", "dni", "telefono", "email", 
                "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "fecha_creacion"
            ],
            include: [
                {
                    model: Contacto,
                    through: { attributes: [] }, // ✅ Relación correcta con la tabla intermedia
                    as: "contactos_asociados",
                },
            ],
        });

        res.status(200).json(clientes);
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await db.clientes.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        const { razon_social, tipo, ruc, dni, domicilio_fiscal, representante_legal, dni_representante, telefono, email, creado_por } = req.body;

        if (!razon_social || !tipo || !creado_por) {
            return res.status(400).json({ mensaje: "Razón social y tipo de cliente son obligatorios." });
        }

        // 📌 Configuración de datos base para cualquier tipo de cliente
        let nuevoClienteData = {
            razon_social,
            tipo,
            telefono: telefono || "",  // 🔥 Si es null, se guarda como ""
            email: email || "",
            creado_por,
        };
        
        if (!email || email.trim() === "") {
            delete nuevoClienteData.email;
        }
        
        // 🔥 Si el cliente es una Persona Jurídica, validamos y asignamos los campos extra
        if (tipo === "Persona Jurídica") {
            // 🔹 Validar los datos de la empresa
            if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
                return res.status(400).json({ mensaje: "Los datos de la Persona Jurídica son obligatorios." });
            }
            nuevoClienteData = {
                ...nuevoClienteData,
                ruc,
                domicilio_fiscal,
                representante_legal,
                dni_representante,
                dni: null,
            };
        } else if (tipo === "Persona Natural") {
            // 🚀 Validar y asignar datos de Persona Natural
            if (!dni) {
                return res.status(400).json({ mensaje: "El DNI es obligatorio para clientes Particulares." });
            }
            nuevoClienteData = {
                ...nuevoClienteData,
                dni,
                ruc: null, // 🔥 Asegurar que no se envíe un RUC
                domicilio_fiscal: null,
                representante_legal: null,
                dni_representante: null,
            };
        } else {
            return res.status(400).json({ mensaje: "Tipo de cliente inválido. Debe ser 'Empresa' o 'Particular'." });
        }

        const nuevoCliente = await db.clientes.create(nuevoClienteData);

        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: nuevoCliente });
    } catch (error) {
        console.error("❌ Error al crear cliente:", error);

        // ✅ Si el error es por clave única duplicada
        if (error.name === "SequelizeUniqueConstraintError") {
            const camposDuplicados = error.errors.map((err) => err.path); // Extrae el campo duplicado
            let mensaje = "Error: ";

            if (camposDuplicados.includes("dni")) {
                mensaje += "El DNI ingresado ya está registrado. ";
            }
            if (camposDuplicados.includes("dni_representante")) {
                mensaje += "El DNI ingresado ya está registrado. ";
            }
            if (camposDuplicados.includes("ruc")) {
                mensaje += "El RUC ingresado ya está registrado. ";
            }
            if (camposDuplicados.includes("email")) {
                mensaje += "El Correo ingresado ya está registrado. ";
            }

            return res.status(400).json({ mensaje: mensaje.trim() });
        }

        // Si el error es otro, responder con error genérico
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// 🔹 Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await db.clientes.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        const { razon_social, tipo, ruc, dni, domicilio_fiscal, representante_legal, dni_representante, telefono, email } = req.body;

        // 📌 Verificar que los datos obligatorios existan
        if (!razon_social || !tipo) {
            return res.status(400).json({ mensaje: "Razón social y tipo de cliente son obligatorios." });
        }

        // 📌 Validar duplicados antes de actualizar
        const condiciones = [];
        if (ruc) condiciones.push({ ruc });
        if (dni) condiciones.push({ dni });
        if (dni_representante) condiciones.push({ dni_representante });
        if (email) condiciones.push({ email });

        if (condiciones.length > 0) {
            const clienteDuplicado = await db.clientes.findOne({
                where: {
                    id: { [db.Sequelize.Op.ne]: id }, // 🔥 Excluye el cliente que se está editando
                    [db.Sequelize.Op.or]: condiciones, // 🔥 Verifica si algún dato ya está en uso
                },
            });

            if (clienteDuplicado) {
                let mensaje = "Error: ";

                if (clienteDuplicado.dni === dni) {
                    mensaje += "El DNI ingresado ya está registrado. ";
                }
                if (clienteDuplicado.dni_representante === dni_representante) {
                    mensaje += "El DNI del representante ya está registrado. ";
                }
                if (clienteDuplicado.ruc === ruc) {
                    mensaje += "El RUC ingresado ya está registrado. ";
                }
                if (clienteDuplicado.email === email) {
                    mensaje += "El Correo ingresado ya está registrado. ";
                }

                return res.status(400).json({ mensaje: mensaje.trim() });
            }
        }

        // 📌 Construir el objeto actualizado
        let datosActualizados = {
            razon_social,
            tipo,
            telefono: telefono || "",
            email: email || "",
        };

        if (!email || email.trim() === "") {
            delete datosActualizados.email;
        }

        if (tipo === "Persona Jurídica") {
            if (!ruc || !domicilio_fiscal || !representante_legal || !dni_representante) {
                return res.status(400).json({ mensaje: "Los datos de la Persona Jurídica son obligatorios." });
            }
            datosActualizados = {
                ...datosActualizados,
                ruc,
                domicilio_fiscal,
                representante_legal,
                dni_representante,
                dni: null,
            };
        } else if (tipo === "Persona Natural") {
            if (!dni) {
                return res.status(400).json({ mensaje: "El DNI es obligatorio para clientes Particulares." });
            }
            datosActualizados = {
                ...datosActualizados,
                dni,
                ruc: null,
                domicilio_fiscal: null,
                representante_legal: null,
                dni_representante: null,
            };
        } else {
            return res.status(400).json({ mensaje: "Tipo de cliente inválido. Debe ser 'Empresa' o 'Particular'." });
        }

        // 🚀 Ejecutar la actualización
        await cliente.update(datosActualizados);

        res.status(200).json({ mensaje: "Cliente actualizado correctamente", cliente });

    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);

        // ✅ Capturar errores de clave única duplicada
        if (error.name === "SequelizeUniqueConstraintError") {
            const camposDuplicados = error.errors.map((err) => err.path);
            let mensaje = "Error: ";

            if (camposDuplicados.includes("dni")) {
                mensaje += "El DNI ingresado ya está registrado. ";
            }
            if (camposDuplicados.includes("dni_representante")) {
                mensaje += "El DNI del representante ya está registrado. ";
            }
            if (camposDuplicados.includes("ruc")) {
                mensaje += "El RUC ingresado ya está registrado. ";
            }
            if (camposDuplicados.includes("email")) {
                mensaje += "El Correo ingresado ya está registrado. ";
            }

            return res.status(400).json({ mensaje: mensaje.trim() });
        }

        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};


// 🔹 Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await db.clientes.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        await cliente.destroy();
        res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
