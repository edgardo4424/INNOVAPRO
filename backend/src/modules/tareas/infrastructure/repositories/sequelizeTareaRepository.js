const { Tarea } = require("../models/tareaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeTareaRepository {
  getModel() {
    return require("../models/tareaModel").Tarea; // Retorna el modelo de cliente
  }

  async crear(tareaData) {

    return await db.tareas.create({
      usuarioId: tareaData.usuarioId,
      empresaProveedoraId: tareaData.empresaProveedoraId,
      clienteId: tareaData.clienteId,
      obraId: tareaData.obraId,
      ubicacion: tareaData.ubicacion,
      tipoTarea: tareaData.tipoTarea,
      estado: "Pendiente",
      detalles: tareaData.detalles ? tareaData.detalles : {}, // ✅ Aseguramos que `detalles` no sea undefined
      contactoId: tareaData.contactoId,
      usoId: tareaData.usoId,
      atributos_valor_zonas: tareaData.atributos_valor_zonas,
      cotizacionId: tareaData.cotizacionId
    });
  }

  async obtenerTareas(id_mis_tareas) {
    let whereTareas = {};
    if (id_mis_tareas) {
      whereTareas = { usuarioId: id_mis_tareas };
    }
    return await Tarea.findAll({
      where: whereTareas,
      include: [
        {
          model: db.usuarios,
          as: "usuario_solicitante",
          attributes: ["id",],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        },
        {
          model: db.usuarios,
          as: "tecnico_asignado",
          attributes: ["id",],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        },
        {
          model: db.empresas_proveedoras,
          as: "empresa_proveedora",
          attributes: ["id", "razon_social"],
        },
        {
          model: db.clientes,
          as: "cliente",
          attributes: ["id", "razon_social"],
        },
        { model: db.obras, as: "obra", attributes: ["id", "nombre"] },
      ],
    });
  }

  async obtenerPorId(id) {

    return await db.tareas.findByPk(id, {
      include: [
        {
          model: db.usuarios,
          as: "usuario_solicitante",
          attributes: ["id",],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        },
        {
          model: db.empresas_proveedoras,
          as: "empresa_proveedora",
          attributes: ["id", "razon_social"],
        },
        {
          model: db.clientes,
          as: "cliente",
          attributes: ["id", "razon_social"],
        },
        { model: db.obras, as: "obra", attributes: ["id", "nombre"] },
      ],
    });
  }

  async tomarTarea(tarea, usuarioId) {

    tarea.asignadoA = usuarioId;
    tarea.estado = "En proceso";

    return await tarea.save();
  }

  async liberarTarea(idTarea, idUsuario) { // idUsuario es el id del usuario que viene del token

    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        }
      ]
    });

    if (!tarea || tarea.asignadoA != idUsuario) {
      return null;
    }

    tarea.asignadoA = null;
    tarea.estado = "Pendiente";

    return await tarea.save();
  }

  async finalizarTarea(idTarea, idUsuario) { // idUsuario es el id del usuario que viene del token

    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        }
      ]
    });

    if (!tarea || tarea.asignadoA != idUsuario) {
      return null;
    }

    tarea.estado = "Finalizada";
    return await tarea.save();
  }

  async cancelarTarea(idTarea, idUsuario) { // idUsuario es el id del usuario que viene del token

    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include: [{
            model: db.trabajadores,
            as: "trabajador"
          }]
        }
      ]
    });

    if (!tarea || tarea.asignadoA != idUsuario) {
      return null;
    }

    tarea.estado = "Cancelada";
    return await tarea.save();
  }

  async devolverTarea(idTarea, motivo, idUsuario, user_name) {
    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado",
          attributes: ["id"],
          include: [{ model: db.trabajadores, as: "trabajador" }],
        },
      ],
    });

    // 1) Validaciones
    if (!tarea) return null;

    // normaliza tipos por si vienen string/number
    const asignadoA = tarea.asignadoA != null ? Number(tarea.asignadoA) : null;
    const usuarioId = Number(idUsuario);
    if (asignadoA === null || asignadoA !== usuarioId) {
      // no está asignada o la intenta devolver alguien distinto
      return null;
    }

    tarea.estado = "Devuelta";
    tarea.motivoDevolucion = motivo ?? "";

    tarea.asignadoA = null;

    // 3) Manejo seguro de 'respuestas'
    const ahoraISO = new Date().toISOString();
    const entrada = {
      motivo: "devolucion",
      mensaje: motivo,
      usuarioId: usuarioId,
      fecha: ahoraISO,
      user_name: user_name
    };

    // función util para parsear seguro
    const parseSeg = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val; // ya es JSON (DataTypes.JSON)
      if (typeof val === "string") {
        const s = val.trim();
        if (s === "") return [];
        try { return JSON.parse(s); } catch { return []; }
      }
      // cualquier otro tipo, volver a empezar
      return [];
    };

    let arr = parseSeg(tarea.respuestas);
    arr.push(entrada);

    // Detecta si el atributo es JSON o texto; si no puedes/quieres inspeccionar el modelo,
    // este approach funciona bien en ambos escenarios:
    if (Array.isArray(tarea.respuestas)) {
      // El campo probablemente es DataTypes.JSON
      tarea.respuestas = arr;
    } else {
      // Probablemente es TEXT/VARCHAR
      tarea.respuestas = JSON.stringify(arr);
    }

    await tarea.save();
    return tarea;
  }




  async corregirTarea(idTarea, correccion, idUsuario, user_name) {
    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado",
          attributes: ["id"],
          include: [{ model: db.trabajadores, as: "trabajador" }],
        },
        {
          model: db.usuarios,
          as: "usuario_solicitante",
          attributes: ["id"],
          include: [{ model: db.trabajadores, as: "trabajador" }],
        },
      ],
    });

    if (!tarea) return null;
    if (tarea.estado !== "Devuelta") return null;

    // Actualizamos el estado y la corrección
    tarea.estado = "Pendiente";
    tarea.asignadoA = null;
    // tarea.correccionComercial = correccion?.trim() || "Sin detalle de corrección";

    const ahoraISO = new Date().toISOString();

    // 🔹 Manejo del historial de respuestas
    try {
      let parsedRespuestas = [];

      // Intentar parsear las respuestas existentes
      if (tarea.respuestas) {
        try {
          parsedRespuestas = JSON.parse(tarea.respuestas);
          if (!Array.isArray(parsedRespuestas)) parsedRespuestas = [];
        } catch {
          parsedRespuestas = [];
        }
      }

      // Agregar la nueva corrección al historial
      parsedRespuestas.push({
        motivo: "correccion",
        mensaje: correccion,
        usuarioId: idUsuario,
        user_name: user_name || "Desconocido",
        fecha: ahoraISO,
      });

      // Guardar en JSON
      tarea.respuestas = JSON.stringify(parsedRespuestas);

      // Guardar cambios
      await tarea.save();

      return tarea;
    } catch (error) {
      console.error("💥 Error al procesar corrección de tarea:", error);
      throw error;
    }
  }



  async eliminarTarea(id) {
    const tarea = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el tarea por ID
    if (!tarea) return null; // Si no se encuentra el tarea, retorna null
    return await tarea.destroy(); // Elimina el tarea y retorna el resultado
  }
}

module.exports = SequelizeTareaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
