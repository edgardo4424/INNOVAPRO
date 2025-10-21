const { Cotizacion } = require("../models/cotizacionModel");

const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

class SequelizeCotizacionRepository {
  getModel() {
    return require("../models/cotizacionModel").Cotizacion; // Retorna el modelo de Cotizacion
  }

  async crear(cotizacionData, transaction = null) {
    return await Cotizacion.create(cotizacionData, { transaction });
  }

  async obtenerCotizaciones() {
    return await Cotizacion.findAll({
      attributes: ["id", "codigo_documento", "tipo_cotizacion", "createdAt"],
      
      include: [
        /*         {
          model: db.contactos,
          as: "contacto",
          attributes: ["id", "nombre"]
        }, */
        {
          model: db.clientes,
          as: "cliente",
          attributes: ["id", "razon_social", "ruc"],
        },
        {
          model: db.obras,
          as: "obra",
          attributes: ["id", "nombre", "direccion"],
        },
        /*          {
          model: db.empresas_proveedoras,
         attributes: ["id", "razon_social"]
        }, */
        {
          model: db.usuarios,
          as: "usuario",
          attributes: ["id"],
          include: [{
            model: db.trabajadores,
            as: "trabajador",
          }],
        },
        {
          model: db.estados_cotizacion,
          as: "estados_cotizacion",
          attributes: ["id", "nombre"],
        },
        {
          model: db.usos,
          as: "uso",
          attributes: ["id", "descripcion"],
        },
        {
          model: db.despieces,
          as: "despiece",
          attributes: ["id", "cp"],
        },
      ],
      order: [["createdAt", "DESC"]], //Ordenar del más nuevo al más viejo
    });
  }

  async obtenerPorId(id, transaction = null) {
    return await Cotizacion.findByPk(id, {
      ...(transaction && { transaction }),
    }); // Llama al método del repositorio para obtener una cotizacion por ID
  }

  async actualizarCotizacion(id, cotizacionData, transaction = null) {

    const cotizacion = await Cotizacion.findByPk(id, {
      ...(transaction && { transaction }),
    });

    if (!cotizacion) {
      console.log("❌ Cotizacion no encontrado");
      return null;
    }

    await cotizacion.update(cotizacionData, {
      ...(transaction && { transaction }),
    });

    return cotizacion;
  }

  // Este método se usa para actualizar el estado de una cotización de acuerdo a los parámetros que recibe
  async actualizarEstado(id, nuevoEstado) {
    const cotizacion = await this.obtenerPorId(id);
    console.log("📦 Actualizando estado de cotización ID", id, "de la cotizacion: ", cotizacion, "a:", nuevoEstado);
    if (!cotizacion) return null;
    cotizacion.estados_cotizacion_id = nuevoEstado;
    await cotizacion.save();
    return cotizacion;
  }


  async eliminarCotizacion(id) {
    const cotizacion = await this.obtenerPorId(id); // Llama al método del repositorio para obtener la cotizacion por ID
    if (!cotizacion) return null; // Si no se encuentra la cotizacion, retorna null
    return await cotizacion.destroy(); // Elimina la cotizacion y retorna el resultado
  }
}

module.exports = SequelizeCotizacionRepository; // Exporta la clase para que pueda ser utilizada en otros módulos