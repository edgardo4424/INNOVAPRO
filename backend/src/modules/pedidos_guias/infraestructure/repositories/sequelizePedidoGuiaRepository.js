const { PedidoGuia } = require("../models/pedidoGuiaModel");

class SequelizePedidoGuiaRepository {
  async crearPedidoGuia(payload, transaction = null) {
    const pedido_guia = await PedidoGuia.create(payload, transaction);
    return pedido_guia;
  }
  async obtenerPedidoGuia(id, transaction = null) {
    const pedido_guia = await PedidoGuia.findByPk(id, { transaction });
    return pedido_guia;
  }
  async actualizarPedidoGuia(id, payload, transaction = null) {
    await PedidoGuia.update(payload, { where: { id }, transaction });
  }
}

module.exports=SequelizePedidoGuiaRepository;
