const { Cotizacion } = require("../models/cotizacionModel");

const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeCotizacionRepository {
  getModel() {
    return require("../models/cotizacionModel").Cotizacion; // Retorna el modelo de Cotizacion
  }

  async crear(cotizacionData, transaction = null) {
    return await Cotizacion.create(cotizacionData, { transaction });
  }

  async obtenerCotizaciones() {
    return await Cotizacion.findAll({
      include: [
        /*         {
          model: db.contactos,
          as: "contacto",
          attributes: ["id", "nombre"]
        }, */
        {
          model: db.clientes,
          as: "cliente",
          attributes: ["id", "razon_social"],
        },
        {
          model: db.obras,
          as: "obra",
          attributes: ["id", "nombre"],
        },
        /*          {
          model: db.empresas_proveedoras,
         attributes: ["id", "razon_social"]
        }, */
        {
          model: db.usuarios,
          as: "usuario",
          attributes: ["id", "nombre"],
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
      ],
    });
  }

  async obtenerPorId(id) {
    return await Cotizacion.findByPk(id); // Llama al método del repositorio para obtener una cotizacion por ID
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

  async eliminarCotizacion(id) {
    const cotizacion = await this.obtenerPorId(id); // Llama al método del repositorio para obtener la cotizacion por ID
    if (!cotizacion) return null; // Si no se encuentra la cotizacion, retorna null
    return await cotizacion.destroy(); // Elimina la cotizacion y retorna el resultado
  }
}

module.exports = SequelizeCotizacionRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
