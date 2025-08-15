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

  async actualizarCondicionesCumplidas(cotizacionId, nuevasCumplidas) {
    const condicion = await CondicionAlquiler.findOne({
      where: { cotizacion_id: cotizacionId },
    });

    if (!condicion) return null;

    // Obtener las condiciones definidas
    const definidas = (condicion.condiciones || "")
      .split("•")
      .map(c => c.trim())
      .filter(Boolean);

    // Validar si ya se cumplieron todas
    const faltantes = definidas.filter(c => !nuevasCumplidas.includes(c));

    const nuevoEstado = faltantes.length === 0 ? "CUMPLIDAS" : condicion.estado;

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
              attributes: ["nombre"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }

}

module.exports = SequelizeCondicionAlquilerRepository;