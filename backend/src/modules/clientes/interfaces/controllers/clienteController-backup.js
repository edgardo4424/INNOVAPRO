const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos
const Cliente = db.clientes; // Llamamos al modelo de clientes
const Contacto = db.contactos; // Llamamos al modelo de contactos
const entidadService = require("../../infrastructure/services/entidadService"); // Llamamos al servicio de validación de datos

// Obtenenemos todos los clientes con sus obras y contactos
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({ // Llamamos todos los clientes con los siguientes atributos
            attributes: [
                "id", "razon_social", "tipo", "ruc", "dni", "telefono", "email", 
                "domicilio_fiscal", "representante_legal", "dni_representante", "creado_por", "fecha_creacion"
            ],
            include: [ // Incluyendo los contactos asociados
                {
                    model: Contacto,
                    through: { attributes: [] }, // ✅ Relación correcta con la tabla intermedia
                    as: "contactos_asociados",
                },
            ],
        });

        res.status(200).json(clientes); // Respondemos con un json de clientes
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// Obtenemos un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await db.clientes.findByPk(req.params.id); // Llamamos al cliente por su id
        if (!cliente) { // Si no existe respondemos con un error
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        } // Si existe respondemos con el cliente solicitado
        res.status(200).json(cliente);
    } catch (error) {
        console.error("❌ Error al obtener cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
    try {
        // Validamos campos obligatorios
        const errorCampos = entidadService.validarCamposObligatorios(req.body, "crear");
        if (errorCampos) return res.status(400).json({ mensaje: errorCampos });

        // Validamos por tipo de cliente
        const errorTipo = entidadService.validarTipoEntidad(req.body);
        if (errorTipo) return res.status(400).json({ mensaje: errorTipo });

        // Validamos los campos duplicados
        const duplicado = await entidadService.verificarDuplicados(db.clientes, req.body);
        if (duplicado) return res.status(400).json({ mensaje: duplicado });

        // Almacenamos los datos del cliente a crear
        const nuevoClienteData = entidadService.construirEntidadData(req.body);

        // Creamos el nuevo cliente con todos sus datos en la base de datos
        const nuevoCliente = await db.clientes.create(nuevoClienteData);

        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: nuevoCliente });
    } catch (error) {
        console.error("❌ Error al crear cliente:", error);

        // Si el error es por clave única duplicada
        if (error.name === "SequelizeUniqueConstraintError") {
            const camposDuplicados = error.errors.map((err) => err.path); // Extrae el campo duplicado
            let mensaje = "Error: ";

            // Evitamos duplicado de datos únicos
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

// Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params; // Almacenamos el id del cliente que vamos a actualizar
        const cliente = await db.clientes.findByPk(id); // Llamamos al cliente a actualizar por su id

        // Si no existe devolvemos error
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        // Validamos campos obligatorios
        const errorCampos = entidadService.validarCamposObligatorios(req.body, "editar");
        if (errorCampos) return res.status(400).json({ mensaje: errorCampos });

        // Validamos por tipo de cliente
        const errorTipo = entidadService.validarTipoEntidad(req.body);
        if (errorTipo) return res.status(400).json({ mensaje: errorTipo });

        // Validamos campos duplicados
        const duplicado = await entidadService.verificarDuplicados(db.clientes, req.body, id);
        if (duplicado) return res.status(400).json({ mensaje: duplicado });

        // Almacenamos la data del cliente a actualizar
        const datosActualizados = entidadService.construirEntidadData(req.body);

        // Ejecutamos la actualización en la base de datos
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

// Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params; // Almacenamos el id del cliente a eliminar
        const cliente = await db.clientes.findByPk(id); // Llamamos al cliente a eliminar por su id

        // Si no existe devolvemos error
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        // Si existe lo eliminamos de la base de datos
        await cliente.destroy();
        res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};
