const { PedidoGuia } = require("../models/pedidoGuiaModel");
const db = require("../../../../database/models");

class SequelizePedidoGuiaRepository {
  async crearPedidoGuia(payload, transaction = null) {
    const pedido_guia = await PedidoGuia.create(payload, { transaction });
    return pedido_guia;
  }
  async obtenerPedidoGuia(id, transaction = null) {
    const pedido_guia = await PedidoGuia.findByPk(id, { transaction });
    return pedido_guia;
  }
  async actualizarPedidoGuia(id, payload, transaction = null) {
    await PedidoGuia.update(payload, { where: { id }, transaction });
    const pedido_guia = await PedidoGuia.findByPk(id, { transaction });
    return pedido_guia;
  }
  async obtenerPedidoGuiaParaTv(transaction = null) {
    const pedidos_guias = await PedidoGuia.findAll({
      transaction,
      include: [
        {
          model: db.guias_de_remision,
          as: "guia_remision",
        },
        {
          model: db.pases_pedidos,
          as: "pase_pedido",
        },
        {
          model: db.contratos,
          as: "contrato",
          include: [
            {
              model: db.clientes,
              as: "cliente",
            },
            {
              model: db.empresas_proveedoras,
              as: "filial",
            },
          ],
        },
      ],
    });
    return pedidos_guias;
  }
}

module.exports = SequelizePedidoGuiaRepository;
