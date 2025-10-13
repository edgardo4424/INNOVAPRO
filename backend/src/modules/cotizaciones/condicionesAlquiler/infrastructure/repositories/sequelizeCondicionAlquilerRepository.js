const db = require("../../../../../database/models"); // Llamamos los modelos sequalize de la base de datos

const CondicionAlquiler = db.condiciones_alquiler;


class SequelizeCondicionAlquilerRepository {
  async crearCondicion(data) {
    return await CondicionAlquiler.create(data);
  }

  async actualizarCondicion(id, datosActualizados) {
    const condicion = await CondicionAlquiler.findByPk(id)

    if (!condicion) return null;
    await condicion.update(datosActualizados);
    return condicion;
  }

  async actualizarCondicionesCumplidas(cotizacionId, nuevasCumplidas, todasCumplidas) {
    const condicion = await CondicionAlquiler.findOne({
      where: { cotizacion_id: cotizacionId },
    });

    if (!condicion) return null;

    const nuevoEstado = todasCumplidas === true ? "CUMPLIDAS" : condicion.estado;

    await condicion.update({
      condiciones_cumplidas: nuevasCumplidas,
      estado: nuevoEstado,
    });

    return condicion;
  }


  async obtenerPorCotizacionId(cotizacionId) {
    return await CondicionAlquiler.findOne({ where: { cotizacion_id: cotizacionId } });
  }

  async listarPendientesConCotizacion() {
    return await CondicionAlquiler.findAll({
      where: { estado: "PENDIENTE" },
      include: [
        {
          model: db.cotizaciones,
          as: "cotizacion",
          include: [
            {
              model: db.clientes,
              attributes: ["razon_social", "ruc"]
            },
            {
              model: db.obras,
              attributes: ["nombre", "direccion"]
            },
            {
              model: db.usuarios,
              attributes: ["id"],
              include: [{
                model: db.trabajadores,
                as: "trabajador",
              }]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }

}

module.exports = SequelizeCondicionAlquilerRepository;