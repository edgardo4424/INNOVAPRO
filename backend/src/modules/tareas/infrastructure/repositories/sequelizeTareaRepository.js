const { Tarea } = require("../models/tareaModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeTareaRepository {
  getModel() {
    return require("../models/tareaModel").Tarea; // Retorna el modelo de cliente
  }

  async crear(tareaData,transaction=null) {
    
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
    },{transaction});
  }

  async obtenerTareas() {
    return await Tarea.findAll({
      include: [
        {
          model: db.usuarios,
          as: "usuario_solicitante",
          attributes: ["id", ],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
          }]
        },
        {
          model: db.usuarios,
          as: "tecnico_asignado",
          attributes: ["id", ],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
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
          attributes: ["id", ],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
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
          include:[{
            model:db.trabajadores,
            as:"trabajador"
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
          include:[{
            model:db.trabajadores,
            as:"trabajador"
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
          include:[{
            model:db.trabajadores,
            as:"trabajador"
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

  async devolverTarea(idTarea, motivo, idUsuario) { // idUsuario es el id del usuario que viene del token
    
    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
          }]
        }
      ]
    });

    if (!tarea || tarea.asignadoA != idUsuario) {
        return null;
    }

    tarea.estado = "Devuelta";
    tarea.motivoDevolucion = motivo;
    return await tarea.save();
  }
  async corregirTarea(idTarea, correcion) { 
    
    const tarea = await Tarea.findByPk(idTarea, {
      include: [
        {
          model: db.usuarios,
          as: "tecnico_asignado", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
          }]
        },
        {
          model: db.usuarios,
          as: "usuario_solicitante", // este alias debe coincidir con tu asociación
          attributes: ["id"],
          include:[{
            model:db.trabajadores,
            as:"trabajador"
          }]
        }
      ]
    });

    if (!tarea) {
        return null;
    }

    if(tarea.estado != "Devuelta") return null;

    tarea.estado = "Pendiente";
    tarea.correccionComercial = correcion;
    tarea.asignadoA = null;

    return await tarea.save();
  }
  

  async eliminarTarea(id) {
    const tarea = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el tarea por ID
    if (!tarea) return null; // Si no se encuentra el tarea, retorna null
    return await tarea.destroy(); // Elimina el tarea y retorna el resultado
  }
}

module.exports = SequelizeTareaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
