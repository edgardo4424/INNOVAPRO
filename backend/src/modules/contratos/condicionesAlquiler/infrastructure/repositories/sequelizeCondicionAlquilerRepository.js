const db = require("../../../../../database/models"); // Llamamos los modelos sequalize de la base de datos

const CondicionAlquiler = db.condiciones_alquiler;


class SequelizeCondicionAlquilerRepository {
  async crearCondicion(data, transaction = null) {
    return await CondicionAlquiler.create(data, { transaction });
  }

  async actualizarCondicion(id, datosActualizados, transaction = null) {
    const condicion = await CondicionAlquiler.findByPk(id, { transaction });

    if (!condicion) return null;
    await condicion.update(datosActualizados, { transaction });
    return condicion;
  }

  async actualizarCondicionesCumplidas(contratoId, nuevasCumplidas, todasCumplidas, transaction = null) {
    const condicion = await CondicionAlquiler.findOne({
      where: { contrato_id: contratoId },
      ...(transaction && { transaction }),
    });

    if (!condicion) return null;

    const nuevoEstado = todasCumplidas === true ? "CUMPLIDAS" : condicion.estado;

    await condicion.update({
      condiciones_cumplidas: nuevasCumplidas,
      estado: nuevoEstado,
    });

    return condicion;
  }


  async obtenerPorContratoId(contratoId, transaction = null) {
    return await CondicionAlquiler.findOne({ where: { contrato_id: contratoId }, ...(transaction && { transaction }) });
  }

  async listarPendientesConContrato(transaction = null) {
    return await CondicionAlquiler.findAll({
      where: { estado: "PENDIENTE" },
      include: [
        {
          model: db.contratos,
          as: "contrato_relacionado",
          include: [
            {
              model: db.clientes,
              as: "cliente",
              attributes: ["razon_social", "ruc"]
            },
            {
              model: db.obras,
              as: "obra",
              attributes: ["nombre", "direccion"]
            },
            {
              model: db.usuarios,
              as: "usuario",
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
    }, { ...(transaction && { transaction }) });
  }

}

module.exports = SequelizeCondicionAlquilerRepository;